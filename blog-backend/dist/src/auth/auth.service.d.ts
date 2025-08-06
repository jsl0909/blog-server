import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
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
