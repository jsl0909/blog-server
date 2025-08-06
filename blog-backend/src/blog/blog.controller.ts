import { Controller, Get, Query, Param, UseGuards, Post, Body, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // 获取公开的文章列表（首页、文章列表页）
  @Get('posts')
  @UseGuards(OptionalJwtAuthGuard)
  async getPosts(@Query() query: any, @Req() req) {
    const { page = 1, limit = 10, category, tag, search, myPosts } = query;
    const userId = req.user?.id;
    
    console.log('getPosts - req.user:', req.user);
    console.log('getPosts - userId:', userId);
    console.log('getPosts - query:', query);
    console.log('getPosts - myPosts:', myPosts);
    
    return this.blogService.getPublishedPosts({
      page: Number(page),
      limit: Number(limit),
      category,
      tag,
      search,
      userId,
      myPosts: myPosts === 'true'
    });
  }

  // 获取分类列表
  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  // 获取标签列表
  @Get('tags')
  async getTags() {
    return this.blogService.getTags();
  }

  // 获取热门标签
  @Get('tags/popular')
  async getPopularTags() {
    return this.blogService.getPopularTags();
  }

  // 获取推荐文章
  @Get('posts/recommended')
  async getRecommendedPosts(@Query('limit') limit = 5) {
    return this.blogService.getRecommendedPosts(Number(limit));
  }

  // 获取最新文章
  @Get('posts/latest')
  async getLatestPosts(@Query('limit') limit = 5) {
    return this.blogService.getLatestPosts(Number(limit));
  }

  // 获取文章详情
  @Get('posts/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPost(@Param('id') id: string, @Req() req) {
    console.log('Received post ID:', id, 'Type:', typeof id);
    
    // 验证ID参数
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      throw new Error('文章ID不能为空');
    }
    
    const postId = Number(id);
    if (isNaN(postId) || postId <= 0) {
      throw new Error('无效的文章ID格式');
    }
    
    const userId = req.user?.id;
    console.log('Calling getPostDetail with postId:', postId, 'userId:', userId);
    return this.blogService.getPostDetail(postId, userId);
  }

  // 点赞文章
  @Post('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.blogService.toggleLike(Number(id), userId);
  }

  // 获取文章评论
  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string, @Query() query: any) {
    const { page = 1, limit = 10 } = query;
    return this.blogService.getComments(Number(id), {
      page: Number(page),
      limit: Number(limit)
    });
  }

  // 添加评论
  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@Param('id') id: string, @Body() data: any, @Req() req) {
    const userId = req.user.id;
    return this.blogService.addComment(Number(id), {
      ...data,
      authorId: userId
    });
  }

  // 获取归档信息
  @Get('archive')
  async getArchive() {
    return this.blogService.getArchive();
  }

  // 站点统计信息
  @Get('stats')
  async getSiteStats() {
    return this.blogService.getSiteStats();
  }

  // 搜索文章
  @Get('search')
  async searchPosts(@Query() query: any) {
    const { q, page = 1, limit = 10 } = query;
    return this.blogService.searchPosts(q, {
      page: Number(page),
      limit: Number(limit)
    });
  }

  // 获取相关文章
  @Get('posts/:id/related')
  async getRelatedPosts(@Param('id') id: string, @Query('limit') limit = 5) {
    return this.blogService.getRelatedPosts(Number(id), Number(limit));
  }
} 