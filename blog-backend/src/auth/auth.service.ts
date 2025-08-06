import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 更新最后登录时间
    await this.usersService.updateLastLogin(user.id);

    // 获取完整用户信息（包括角色）
    const fullUser = await this.usersService.findById(user.id);

    const payload = { sub: fullUser.id, email: fullUser.email, roles: fullUser.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        username: fullUser.username,
        nickname: fullUser.nickname,
        avatar: fullUser.avatar,
        roles: fullUser.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // 验证密码确认
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    // 检查邮箱是否已存在
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('邮箱已被使用');
    }

    // 检查用户名是否已存在
    const existingUsername = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new UnauthorizedException('用户名已被使用');
    }

    // 创建用户DTO（移除confirmPassword字段）
    const createUserDto: CreateUserDto = {
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      nickname: registerDto.nickname,
      avatar: registerDto.avatar,
    };

    // 创建用户
    const user = await this.usersService.create(createUserDto);
    // user已经不包含password字段了

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        roles: user.roles,
      },
    };
  }
} 