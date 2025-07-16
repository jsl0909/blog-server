export declare class UploadService {
    uploadFile(file: Express.Multer.File): {
        url: string;
        originalname: string;
        size: number;
    };
}
