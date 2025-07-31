import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: any, @Req() req) {
    const userId = req.user.id;
    return this.postsService.create({ ...createPostDto, userId });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: any, @Req() req) {
    const userId = req.user.id;
    return this.postsService.update(+id, { ...updatePostDto, userId });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    // 这里可以添加权限检查，确保用户只能删除自己的文章
    return this.postsService.remove(+id);
  }
} 