import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PostsModule } from '../posts/posts.module';
import { TagsModule } from '../tags/tags.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [PostsModule, TagsModule, CategoriesModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {} 