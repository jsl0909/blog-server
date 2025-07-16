import request from './request'

export interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  updatedAt: string
  roles: Array<{
    id: number
    name: string
    permissions: Array<{
      id: number
      name: string
      action: string
      resource: string
    }>
  }>
  _count?: {
    posts: number
    comments: number
  }
}

export interface UserQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  roleId?: number
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  roleIds?: number[]
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  status?: 'active' | 'inactive' | 'banned'
  roleIds?: number[]
}

export interface Role {
  id: number
  name: string
  description?: string
  permissions: Array<{
    id: number
    name: string
    action: string
    resource: string
  }>
}

// 用户相关API
export const usersApi = {
  // 获取用户列表
  getList: (params?: UserQuery) => request.get('/users', { params }),
  
  // 获取用户详情
  getById: (id: number) => request.get(`/users/${id}`),
  
  // 创建用户
  create: (data: CreateUserDto) => request.post('/users', data),
  
  // 更新用户
  update: (id: number, data: UpdateUserDto) => request.patch(`/users/${id}`, data),
  
  // 删除用户
  delete: (id: number) => request.delete(`/users/${id}`),
  
  // 获取角色列表
  getRoles: () => request.get('/roles'),
} 