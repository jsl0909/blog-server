import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      originalname: file.originalname,
      size: file.size,
    };
  }
} 