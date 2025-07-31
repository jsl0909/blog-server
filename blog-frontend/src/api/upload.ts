import request from './request';

export interface UploadResponse {
  url: string;
  originalname: string;
  size: number;
}

export interface MarkdownUploadResponse {
  success: boolean;
  data?: {
    post: any;
    originalFile: {
      originalname: string;
      filename: string;
      size: number;
    };
  };
  error?: string;
}

export const uploadAPI = {
  // 普通文件上传
  uploadFile: (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return request.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Markdown文件上传并转换为博客
  uploadMarkdown: (file: File): Promise<MarkdownUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload/markdown', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 