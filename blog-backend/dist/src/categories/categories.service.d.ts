import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    create(data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
}
