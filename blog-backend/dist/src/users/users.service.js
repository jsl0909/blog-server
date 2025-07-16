"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: createUserDto.username },
                    { email: createUserDto.email },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('用户名或邮箱已存在');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createData = {
            username: createUserDto.username,
            email: createUserDto.email,
            password: hashedPassword,
            nickname: createUserDto.nickname,
            avatar: createUserDto.avatar,
            status: createUserDto.status ? createUserDto.status.toUpperCase() : 'ACTIVE',
        };
        if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
            createData.roleId = createUserDto.roleIds[0];
        }
        else {
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
        const { password, ...result } = user;
        return {
            ...result,
            roles: [result.role],
        };
    }
    async findAll(page, limit, search, status, roleId) {
        const skip = (page - 1) * limit;
        const where = {};
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
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                status: userWithoutPassword.status.toLowerCase(),
                roles: [userWithoutPassword.role],
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
    async findById(id) {
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
            throw new common_1.NotFoundException('用户不存在');
        }
        const { password, ...result } = user;
        return {
            ...result,
            status: result.status.toLowerCase(),
            roles: [result.role],
        };
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
            include: { role: true },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        const updateData = { ...updateUserDto };
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
            updateData.roleId = updateUserDto.roleIds[0];
            delete updateData.roleIds;
        }
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
            roles: [result.role],
        };
    }
    async updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        if (user.role.name === 'super_admin') {
            throw new common_1.ConflictException('不能删除超级管理员账号');
        }
        await this.prisma.user.delete({ where: { id } });
        return { message: '用户删除成功' };
    }
    async findAllRoles() {
        return this.prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map