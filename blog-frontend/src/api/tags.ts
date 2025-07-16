import request from './request'

export interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

export interface CreateTagDto {
  name: string
  color?: string
  description?: string
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}

// 标签相关API
export const tagsApi = {
  // 获取标签列表
  getList: () => request.get('/tags'),
  
  // 获取标签详情
  getById: (id: number) => request.get(`/tags/${id}`),
  
  // 创建标签
  create: (data: CreateTagDto) => request.post('/tags', data),
  
  // 更新标签
  update: (id: number, data: UpdateTagDto) => request.patch(`/tags/${id}`, data),
  
  // 删除标签
  delete: (id: number) => request.delete(`/tags/${id}`),
} 