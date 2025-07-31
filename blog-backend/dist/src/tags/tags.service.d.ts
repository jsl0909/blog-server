import { PrismaService } from '../prisma/prisma.service';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    findByName(name: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    create(data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
}
