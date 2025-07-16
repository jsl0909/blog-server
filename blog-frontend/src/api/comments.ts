import request from './request'

export interface Comment {
  id: number
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    name: string
    email: string
  }
  post?: {
    id: number
    title: string
  }
  parent?: {
    id: number
    content: string
    author: {
      name: string
    }
  }
  replies?: Comment[]
}

export interface CommentQuery {
  page?: number
  limit?: number
  status?: string
  postId?: number
  authorId?: number
}

export interface UpdateCommentStatusDto {
  status: 'pending' | 'approved' | 'rejected'
}

// 评论相关API
export const commentsApi = {
  // 获取评论列表
  getList: (params?: CommentQuery) => request.get('/comments', { params }),
  
  // 获取评论详情
  getById: (id: number) => request.get(`/comments/${id}`),
  
  // 更新评论状态
  updateStatus: (id: number, data: UpdateCommentStatusDto) => 
    request.patch(`/comments/${id}/status`, data),
  
  // 删除评论
  delete: (id: number) => request.delete(`/comments/${id}`),
  
  // 批量删除评论
  batchDelete: (ids: number[]) => request.post('/comments/batch-delete', { ids }),
  
  // 批量审核通过
  batchApprove: (ids: number[]) => request.post('/comments/batch-approve', { ids }),
  
  // 批量拒绝
  batchReject: (ids: number[]) => request.post('/comments/batch-reject', { ids }),
} 