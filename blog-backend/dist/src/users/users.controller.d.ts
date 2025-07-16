import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findAll(page?: string, limit?: string, search?: string, status?: string, roleId?: string): Promise<{
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
    getProfile(req: any): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class RolesController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllRoles(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
