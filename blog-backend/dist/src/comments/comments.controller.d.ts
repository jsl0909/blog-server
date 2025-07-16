import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommentStatus;
        parentId: number | null;
        content: string;
        likeCount: number;
        authorId: number;
        postId: number;
    }[]>;
    findOne(id: string): Promise<{
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
    create(createCommentDto: any): Promise<{
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
    update(id: string, updateCommentDto: any): Promise<{
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
    remove(id: string): Promise<{
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
}
