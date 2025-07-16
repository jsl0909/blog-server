import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    create(data: any): Promise<{
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
    update(id: number, data: any): Promise<{
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
    remove(id: number): Promise<{
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
