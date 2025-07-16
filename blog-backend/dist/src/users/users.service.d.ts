import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        roles: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastLoginAt: Date | null;
    }>;
    findAll(page: number, limit: number, search?: string, status?: string, roleId?: number): Promise<{
        users: {
            status: string;
            roles: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            role: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            _count: {
                posts: number;
                comments: number;
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
            roleId: number;
            email: string;
            username: string;
            nickname: string | null;
            avatar: string | null;
            bio: string | null;
            lastLoginAt: Date | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<{
        status: string;
        roles: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        _count: {
            posts: number;
            comments: number;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        lastLoginAt: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        password: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastLoginAt: Date | null;
    }>;
    findByUsername(username: string): Promise<{
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        password: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastLoginAt: Date | null;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        status: string;
        roles: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        role: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        lastLoginAt: Date | null;
    }>;
    updateLastLogin(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        email: string;
        username: string;
        password: string;
        nickname: string | null;
        avatar: string | null;
        bio: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastLoginAt: Date | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findAllRoles(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
