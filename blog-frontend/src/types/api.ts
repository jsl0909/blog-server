// API响应类型定义

export interface BlogPost {
  id: number
  title: string
  content: string
  summary?: string
  excerpt?: string
  coverImage?: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
  isLiked?: boolean
  author: {
    id: number
    username: string
    nickname?: string
    avatar?: string
    bio?: string
  }
  category?: {
    id: number
    name: string
  }
  tags?: Array<{
    id: number
    name: string
    color?: string
  }>
  commentCount?: number
}

export interface PostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LikeResponse {
  liked: boolean
  message: string
}

export interface Category {
  id: number
  name: string
  description?: string
  postCount?: number
}

export interface Tag {
  id: number
  name: string
  color?: string
  postCount?: number
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    id: number
    username: string
    nickname?: string
    avatar?: string
  }
  replies?: Comment[]
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SiteStats {
  postCount: number
  categoryCount: number
  tagCount: number
  commentCount: number
  totalViews: number
} 