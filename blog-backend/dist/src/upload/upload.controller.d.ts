import { UploadService } from './upload.service';
import { PostsService } from '../posts/posts.service';
import { TagsService } from '../tags/tags.service';
import { CategoriesService } from '../categories/categories.service';
import { Request as ExpressRequest } from 'express';
interface AuthRequest extends ExpressRequest {
    user?: any;
}
export declare class UploadController {
    private readonly uploadService;
    private readonly postsService;
    private readonly tagsService;
    private readonly categoriesService;
    constructor(uploadService: UploadService, postsService: PostsService, tagsService: TagsService, categoriesService: CategoriesService);
    uploadFile(file: Express.Multer.File): {
        url: string;
        originalname: string;
        size: number;
    };
    uploadMarkdownFile(file: Express.Multer.File, body: any, req: AuthRequest): Promise<{
        success: boolean;
        error: any;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            post: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PostStatus;
                title: string;
                summary: string | null;
                content: string;
                categoryId: number | null;
                coverImage: string | null;
                viewCount: number;
                likeCount: number;
                authorId: number;
                publishedAt: Date | null;
            };
            originalFile: {
                originalname: string;
                filename: string;
                size: number;
            };
        };
        error?: undefined;
    }>;
}
export {};
