import request from './request'

export interface Category {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// 分类相关API
export const categoriesApi = {
  // 获取分类列表
  getList: () => request.get('/categories'),
  
  // 获取分类详情
  getById: (id: number) => request.get(`/categories/${id}`),
  
  // 创建分类
  create: (data: CreateCategoryDto) => request.post('/categories', data),
  
  // 更新分类
  update: (id: number, data: UpdateCategoryDto) => request.patch(`/categories/${id}`, data),
  
  // 删除分类
  delete: (id: number) => request.delete(`/categories/${id}`),
} 