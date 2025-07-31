import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        posts: {
            id: number;
            title: string;
            summary: string;
            coverImage: string;
            publishedAt: Date;
            viewCount: number;
            likeCount: number;
            author: {
                id: number;
                username: string;
                nickname: string;
            };
            category: {
                id: number;
                name: string;
            };
            tags: {
                id: number;
                name: string;
            }[];
            status: import(".prisma/client").$Enums.PostStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<{
        tags: {
            id: number;
            name: string;
        }[];
        category: {
            id: number;
            name: string;
        };
        author: {
            id: number;
            username: string;
            nickname: string;
        };
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
    }>;
    create(data: any): Promise<{
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
    }>;
    update(id: number, data: any): Promise<{
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
