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
    username: string
    nickname?: string
  }
  category?: {
    id: number
    name: string
  }
  tags?: Array<{
    id: number
    name: string
  }>
  viewCount?: number
}

export interface CreatePostDto {
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'DRAFT' | 'PUBLISHED'
  categoryId?: number
  tagIds?: number[]
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  status?: 'draft' | 'published' | 'DRAFT' | 'PUBLISHED'
}

export interface PostQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  categoryId?: number
  authorId?: number
}

export interface PostForm {
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  categoryId?: number
  tagIds: number[]
}

export interface Category {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
  color?: string
  createdAt: string
  updatedAt: string
} 