"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const posts_service_1 = require("../posts/posts.service");
const tags_service_1 = require("../tags/tags.service");
const categories_service_1 = require("../categories/categories.service");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UploadController = class UploadController {
    constructor(uploadService, postsService, tagsService, categoriesService) {
        this.uploadService = uploadService;
        this.postsService = postsService;
        this.tagsService = tagsService;
        this.categoriesService = categoriesService;
    }
    uploadFile(file) {
        return this.uploadService.uploadFile(file);
    }
    async uploadMarkdownFile(file, body, req) {
        console.log('当前用户user:', req.user);
        try {
            const result = await this.uploadService.processMarkdownFile(file);
            if (!result.success) {
                return { success: false, error: result.error };
            }
            const { data } = result;
            const userId = req.user && req.user.id;
            if (!userId) {
                return { success: false, error: '用户未登录或无效' };
            }
            let tagIds = [];
            if (data.tags && Array.isArray(data.tags)) {
                for (const tagName of data.tags) {
                    let tag = await this.tagsService.findByName(tagName);
                    if (!tag) {
                        tag = await this.tagsService.create({ name: tagName });
                    }
                    tagIds.push(tag.id);
                }
            }
            let categoryId = null;
            if (data.category) {
                let category = await this.categoriesService.findByName(data.category);
                if (!category) {
                    category = await this.categoriesService.create({ name: data.category });
                }
                categoryId = category.id;
            }
            const postData = {
                userId: Number(userId),
                title: data.title,
                content: data.content,
                summary: data.summary,
                coverImage: data.coverImage,
                status: 'PUBLISHED',
                categoryId,
                tagIds,
                publishedAt: data.publishedAt
            };
            const post = await this.postsService.create(postData);
            return {
                success: true,
                data: {
                    post,
                    originalFile: {
                        originalname: data.originalname,
                        filename: data.filename,
                        size: data.size
                    }
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('markdown'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('USER', 'ADMIN', 'AUTHOR', 'SUPER_ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
                cb(null, true);
            }
            else {
                cb(new Error('只允许上传Markdown文件'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMarkdownFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        posts_service_1.PostsService,
        tags_service_1.TagsService,
        categories_service_1.CategoriesService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map