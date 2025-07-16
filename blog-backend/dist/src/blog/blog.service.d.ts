import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getPublishedPosts(options: {
        page: number;
        limit: number;
        category?: string;
        tag?: string;
        search?: string;
    }): Promise<{
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
    getPostDetail(id: number, userId?: number): Promise<{
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
    getPopularTags(limit?: number): Promise<{
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
    toggleLike(postId: number, userId: number): Promise<{
        liked: boolean;
        message: string;
    }>;
    getComments(postId: number, options: {
        page: number;
        limit: number;
    }): Promise<{
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
    addComment(postId: number, data: {
        content: string;
        authorId: number;
        parentId?: number;
    }): Promise<{
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
    searchPosts(query: string, options: {
        page: number;
        limit: number;
    }): Promise<{
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
    getRelatedPosts(postId: number, limit?: number): Promise<{
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
