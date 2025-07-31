import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getPosts(query: any, req: any): Promise<{
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
            status: import(".prisma/client").$Enums.PostStatus;
            isOwnPost: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
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
        excerpt: string;
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
        excerpt: string;
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
    getPost(id: string, req: any): Promise<{
        tags: {
            id: number;
            name: string;
            color: string;
        }[];
        commentCount: number;
        isLiked: boolean;
        isOwnPost: boolean;
        author: {
            id: number;
            username: string;
            nickname: string;
            avatar: string;
            bio: string;
        };
        category: {
            id: number;
            name: string;
        };
        _count: {
            comments: number;
            likes: number;
        };
        id: number;
        title: string;
        content: string;
        summary: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        viewCount: number;
        likeCount: number;
        authorId: number;
        categoryId: number | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
                content: string;
                status: import(".prisma/client").$Enums.CommentStatus;
                likeCount: number;
                authorId: number;
                createdAt: Date;
                updatedAt: Date;
                parentId: number | null;
                postId: number;
            })[];
        } & {
            id: number;
            content: string;
            status: import(".prisma/client").$Enums.CommentStatus;
            likeCount: number;
            authorId: number;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
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
        content: string;
        status: import(".prisma/client").$Enums.CommentStatus;
        likeCount: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
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
