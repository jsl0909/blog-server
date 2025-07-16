import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            nickname: string;
            avatar: string;
            roles: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            nickname: string;
            avatar: string;
            roles: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
}
