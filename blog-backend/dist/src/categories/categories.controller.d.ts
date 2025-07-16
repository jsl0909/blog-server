import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    create(createCategoryDto: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    update(id: string, updateCategoryDto: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        sort: number;
    }>;
}
