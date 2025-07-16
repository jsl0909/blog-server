import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        postCount: number;
        userCount: number;
        commentCount: number;
        categoryCount: number;
    }>;
}
