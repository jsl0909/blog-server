import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
                name: string;
                id: number;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            nickname: string;
            avatar: string;
            roles: {
                name: string;
                id: number;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
}
