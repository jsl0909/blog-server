import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  username: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123', minLength: 6 })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;

  @ApiProperty({ description: '确认密码', example: 'password123' })
  @IsString({ message: '确认密码必须是字符串' })
  confirmPassword: string;

  @ApiProperty({ description: '昵称', required: false, example: '测试用户' })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  nickname?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;
} 