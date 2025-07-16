import request from './request'
import type { LoginForm, RegisterForm, LoginResponse, RegisterResponse } from '@/types/auth'

export const authApi = {
  // 用户登录
  login: (data: LoginForm): Promise<LoginResponse> => {
    return request.post('/auth/login', data)
  },

  // 用户注册
  register: (data: RegisterForm): Promise<RegisterResponse> => {
    return request.post('/auth/register', data)
  }
} 