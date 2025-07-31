import axios from 'axios'
import type { PostsResponse, BlogPost, LikeResponse, Category, Tag, CommentsResponse, SiteStats } from '@/types/api'
import { uploadAPI } from './upload'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000', // 后端服务地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理错误响应
    if (error.response?.status === 401) {
      // 清除token并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// 博客API接口
export const blogApi = {
  // 获取文章列表
  getPosts: (params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }): Promise<PostsResponse> =>
    api.get('/api/blog/posts', { params }),

  // 获取文章详情
  getPost: (id: number): Promise<BlogPost> =>
    api.get(`/api/blog/posts/${id}`),

  // 获取分类列表
  getCategories: (): Promise<Category[]> =>
    api.get('/api/blog/categories'),

  // 获取标签列表
  getTags: (): Promise<Tag[]> =>
    api.get('/api/blog/tags'),

  // 获取热门标签
  getPopularTags: (): Promise<Tag[]> =>
    api.get('/api/blog/tags/popular'),

  // 获取推荐文章
  getRecommendedPosts: (limit = 5): Promise<BlogPost[]> =>
    api.get('/api/blog/posts/recommended', { params: { limit } }),

  // 获取最新文章
  getLatestPosts: (limit = 5): Promise<BlogPost[]> =>
    api.get('/api/blog/posts/latest', { params: { limit } }),

  // 点赞文章
  likePost: (id: number): Promise<LikeResponse> =>
    api.post(`/api/blog/posts/${id}/like`),

  // 获取文章评论
  getComments: (id: number, params?: { page?: number; limit?: number }): Promise<CommentsResponse> =>
    api.get(`/api/blog/posts/${id}/comments`, { params }),

  // 添加评论
  addComment: (id: number, data: { content: string; parentId?: number }) =>
    api.post(`/api/blog/posts/${id}/comments`, data),

  // 获取归档信息
  getArchive: () =>
    api.get('/api/blog/archive'),

  // 获取站点统计
  getSiteStats: (): Promise<SiteStats> =>
    api.get('/api/blog/stats'),

  // 搜索文章
  searchPosts: (params: { q: string; page?: number; limit?: number }): Promise<PostsResponse> =>
    api.get('/api/blog/search', { params }),

  // 获取相关文章
  getRelatedPosts: (id: number, limit = 5): Promise<BlogPost[]> =>
    api.get(`/api/blog/posts/${id}/related`, { params: { limit } })
}

// 认证API
export const authApi = {
  // 登录
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),

  // 注册
  register: (data: { email: string; username: string; password: string; nickname?: string }) =>
    api.post('/api/auth/register', data),

  // 获取用户信息
  getProfile: () =>
    api.get('/api/users/profile')
}

// 管理API
export const adminApi = {
  // 获取文章列表（包含所有状态）
  getPosts: (params?: any) =>
    api.get('/api/posts', { params }),

  // 创建文章
  createPost: (data: any) =>
    api.post('/api/posts', data),

  // 更新文章
  updatePost: (id: number, data: any) =>
    api.patch(`/api/posts/${id}`, data),

  // 删除文章
  deletePost: (id: number) =>
    api.delete(`/api/posts/${id}`),

  // 管理分类
  createCategory: (data: any) =>
    api.post('/api/categories', data),

  updateCategory: (id: number, data: any) =>
    api.patch(`/api/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete(`/api/categories/${id}`),

  // 管理标签
  createTag: (data: any) =>
    api.post('/api/tags', data),

  updateTag: (id: number, data: any) =>
    api.patch(`/api/tags/${id}`, data),

  deleteTag: (id: number) =>
    api.delete(`/api/tags/${id}`)
}

export { uploadAPI }
export default api 