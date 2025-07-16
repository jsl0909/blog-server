import request from './request'

export interface StatsData {
  postCount: number
  userCount: number
  commentCount: number
  categoryCount: number
}

export interface User {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  status: string
  roles: Role[]
  _count: {
    posts: number
    comments: number
  }
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  description?: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  nickname?: string
  avatar?: string
  status?: string
  roleIds?: number[]
}

export interface UpdateUserData {
  username?: string
  email?: string
  password?: string
  nickname?: string
  avatar?: string
  status?: string
  roleIds?: number[]
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 获取统计数据
export const adminApi = {
  // 获取仪表盘统计数据
  getStats(): Promise<StatsData> {
    return request.get('/admin/stats')
  },

  // 用户管理
  getUsers(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    roleId?: number
  } = {}): Promise<UsersResponse> {
    return request.get('/users', { params })
  },

  createUser(data: CreateUserData): Promise<User> {
    return request.post('/users', data)
  },

  updateUser(id: number, data: UpdateUserData): Promise<User> {
    return request.patch(`/users/${id}`, data)
  },

  deleteUser(id: number): Promise<{ message: string }> {
    return request.delete(`/users/${id}`)
  },

  getUserById(id: number): Promise<User> {
    return request.get(`/users/${id}`)
  },

  // 角色管理
  getRoles(): Promise<Role[]> {
    return request.get('/roles')
  }
} 