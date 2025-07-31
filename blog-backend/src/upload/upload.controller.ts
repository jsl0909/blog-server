import { Controller, Post, UploadedFile, UseInterceptors, Body, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { PostsService } from '../posts/posts.service';
import { TagsService } from '../tags/tags.service';
import { CategoriesService } from '../categories/categories.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user?: any;
}

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

  @Post('markdown')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'AUTHOR', 'SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
        cb(null, true);
      } else {
        cb(new Error('只允许上传Markdown文件'), false);
      }
    },
  }))
  async uploadMarkdownFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: AuthRequest
  ) {
    console.log('当前用户user:', req.user);
    try {
      // 处理Markdown文件
      const result = await this.uploadService.processMarkdownFile(file);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      const { data } = result;
      const userId = req.user && (req.user as any).id;

      if (!userId) {
        return { success: false, error: '用户未登录或无效' };
      }

      // 处理标签
      let tagIds = [];
      if (data.tags && Array.isArray(data.tags)) {
        for (const tagName of data.tags) {
          let tag = await this.tagsService.findByName(tagName);
          if (!tag) {
            tag = await this.tagsService.create({ name: tagName });
          }
          tagIds.push(tag.id);
        }
      }

      // 处理分类
      let categoryId = null;
      if (data.category) {
        let category = await this.categoriesService.findByName(data.category);
        if (!category) {
          category = await this.categoriesService.create({ name: data.category });
        }
        categoryId = category.id;
      }

      // 创建文章
      const postData = {
        userId: Number(userId),
        title: data.title,
        content: data.content,
        summary: data.summary,
        coverImage: data.coverImage,
        status: 'PUBLISHED',
        categoryId,
        tagIds,
        publishedAt: data.publishedAt
      };

      const post = await this.postsService.create(postData);

      return {
        success: true,
        data: {
          post,
          originalFile: {
            originalname: data.originalname,
            filename: data.filename,
            size: data.size
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
} 