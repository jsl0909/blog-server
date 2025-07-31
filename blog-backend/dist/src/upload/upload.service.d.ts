export declare class UploadService {
    uploadFile(file: Express.Multer.File): {
        url: string;
        originalname: string;
        size: number;
    };
    processMarkdownFile(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            title: any;
            summary: any;
            content: string;
            tags: any[];
            category: any;
            status: any;
            coverImage: any;
            publishedAt: Date;
            originalname: string;
            filename: string;
            size: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    private parseMarkdownContent;
    private parseYamlFrontMatter;
}
