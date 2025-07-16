import { TagsService } from './tags.service';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    create(createTagDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    update(id: string, updateTagDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    }>;
}
