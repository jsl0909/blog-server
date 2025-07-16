import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 准备创建数据
    const createData: any = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      nickname: createUserDto.nickname,
      avatar: createUserDto.avatar,
      status: createUserDto.status ? createUserDto.status.toUpperCase() : 'ACTIVE',
    };

    // 如果指定了角色ID，使用第一个角色ID，否则默认为用户角色
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      createData.roleId = createUserDto.roleIds[0];
    } else {
      // 默认分配用户角色
      const userRole = await this.prisma.role.findUnique({
        where: { name: 'user' },
      });
      if (userRole) {
        createData.roleId = userRole.id;
      }
    }

    const user = await this.prisma.user.create({
      data: createData,
      include: {
        role: true,
      },
    });

    // 不返回密码
    const { password, ...result } = user;
    return {
      ...result,
      roles: [result.role], // 转换为数组格式以保持API一致性
    };
  }

  async findAll(page: number, limit: number, search?: string, status?: string, roleId?: number) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { nickname: { contains: search } },
      ];
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (roleId) {
      where.roleId = roleId;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // 不返回密码，并转换角色格式
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        status: userWithoutPassword.status.toLowerCase(),
        roles: [userWithoutPassword.role], // 转换为数组格式
      };
    });

    return {
      users: usersWithoutPassword,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...result } = user;
    return {
      ...result,
      status: result.status.toLowerCase(),
      roles: [result.role], // 转换为数组格式
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 如果更新密码，需要加密
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 如果更新角色，使用第一个角色ID
    if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
      updateData.roleId = updateUserDto.roleIds[0];
      delete updateData.roleIds;
    }

    // 如果更新状态，转换为大写
    if (updateUserDto.status) {
      updateData.status = updateUserDto.status.toUpperCase();
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password, ...result } = updatedUser;
    return {
      ...result,
      status: result.status.toLowerCase(),
      roles: [result.role], // 转换为数组格式
    };
  }

  async updateLastLogin(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { role: true }
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查是否为超级管理员，不能删除
    if (user.role.name === 'super_admin') {
      throw new ConflictException('不能删除超级管理员账号');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: '用户删除成功' };
  }

  async findAllRoles() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }
} 