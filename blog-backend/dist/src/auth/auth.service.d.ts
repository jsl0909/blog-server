import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
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
    register(createUserDto: CreateUserDto): Promise<{
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
