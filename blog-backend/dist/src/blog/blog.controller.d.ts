import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getPosts(query: any): Promise<{
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
                avatar: string;
            };
            category: {
                id: number;
                name: string;
            };
            tags: {
                id: number;
                name: string;
                color: string;
            }[];
            commentCount: number;
            excerpt: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPost(id: string, req: any): Promise<{
        tags: {
            id: number;
            name: string;
            color: string;
        }[];
        commentCount: number;
        isLiked: boolean;
        _count: {
            comments: number;
            likes: number;
        };
        category: {
            id: number;
            name: string;
        };
        author: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
            bio: string;
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
    getCategories(): Promise<{
        id: number;
        name: string;
        description: string;
        postCount: number;
    }[]>;
    getTags(): Promise<{
        id: number;
        name: string;
        color: string;
        postCount: number;
    }[]>;
    getPopularTags(): Promise<{
        id: number;
        name: string;
        color: string;
        postCount: number;
    }[]>;
    getRecommendedPosts(limit?: number): Promise<{
        id: number;
        title: string;
        summary: string;
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
    }[]>;
    getLatestPosts(limit?: number): Promise<{
        id: number;
        title: string;
        summary: string;
        publishedAt: Date;
        viewCount: number;
        author: {
            id: number;
            username: string;
            nickname: string;
        };
        category: {
            id: number;
            name: string;
        };
    }[]>;
    likePost(id: string, req: any): Promise<{
        liked: boolean;
        message: string;
    }>;
    getComments(id: string, query: any): Promise<{
        comments: ({
            author: {
                id: number;
                username: string;
                nickname: string;
                avatar: string;
            };
            replies: ({
                author: {
                    id: number;
                    username: string;
                    nickname: string;
                    avatar: string;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.CommentStatus;
                parentId: number | null;
                content: string;
                likeCount: number;
                authorId: number;
                postId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CommentStatus;
            parentId: number | null;
            content: string;
            likeCount: number;
            authorId: number;
            postId: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    addComment(id: string, data: any, req: any): Promise<{
        author: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommentStatus;
        parentId: number | null;
        content: string;
        likeCount: number;
        authorId: number;
        postId: number;
    }>;
    getArchive(): Promise<{}>;
    getSiteStats(): Promise<{
        postCount: number;
        categoryCount: number;
        tagCount: number;
        commentCount: number;
        totalViews: number;
    }>;
    searchPosts(query: any): Promise<{
        posts: {
            id: number;
            title: string;
            summary: string;
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
                color: string;
            }[];
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRelatedPosts(id: string, limit?: number): Promise<{
        id: number;
        title: string;
        summary: string;
        publishedAt: Date;
        viewCount: number;
        author: {
            id: number;
            username: string;
            nickname: string;
        };
        category: {
            id: number;
            name: string;
        };
    }[]>;
}
