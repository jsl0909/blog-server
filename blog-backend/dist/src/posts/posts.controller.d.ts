import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(query: any): Promise<{
        posts: ({
            category: {
                id: number;
                name: string;
            };
            tags: {
                tag: {
                    id: number;
                    name: string;
                };
            }[];
            author: {
                id: number;
                username: string;
                nickname: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        category: {
            id: number;
            name: string;
        };
        tags: {
            tag: {
                id: number;
                name: string;
            };
        }[];
        author: {
            id: number;
            username: string;
            nickname: string;
        };
    } & {
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
    create(createPostDto: any, req: any): Promise<{
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
    update(id: string, updatePostDto: any): Promise<{
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
    remove(id: string): Promise<{
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
