import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        postCount: number;
        userCount: number;
        commentCount: number;
        categoryCount: number;
    }>;
}
