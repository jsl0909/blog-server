export interface User {
  id: number
  email: string
  username: string
  nickname?: string
  avatar?: string
  bio?: string
  roles: Role[]
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  description?: string
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  username: string
  password: string
  nickname?: string
  bio?: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface RegisterResponse {
  access_token: string
  user: User
} 