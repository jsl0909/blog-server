import request from './request'

export interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    name: string
  }
  category?: {
    id: number
    name: string
  }
  tags?: Array<{
    id: number
    name: string
  }>
}

export interface CreatePostDto {
  title: string
  content: string
  excerpt?: string
  status?: 'draft' | 'published'
  categoryId?: number
  tagIds?: number[]
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface PostQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  categoryId?: number
  authorId?: number
}

// 文章相关API
export const postsApi = {
  // 获取文章列表
  getList: (params?: PostQuery) => request.get('/posts', { params }),
  
  // 获取文章详情
  getById: (id: number) => request.get(`/posts/${id}`),
  
  // 创建文章
  create: (data: CreatePostDto) => request.post('/posts', data),
  
  // 更新文章
  update: (id: number, data: UpdatePostDto) => request.patch(`/posts/${id}`, data),
  
  // 删除文章
  delete: (id: number) => request.delete(`/posts/${id}`),
  
  // 批量删除文章
  batchDelete: (ids: number[]) => request.post('/posts/batch-delete', { ids }),
} 