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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async getPosts(query) {
        const { page = 1, limit = 10, category, tag, search } = query;
        return this.blogService.getPublishedPosts({
            page: Number(page),
            limit: Number(limit),
            category,
            tag,
            search
        });
    }
    async getPost(id, req) {
        const userId = req.user?.id;
        return this.blogService.getPostDetail(Number(id), userId);
    }
    async getCategories() {
        return this.blogService.getCategories();
    }
    async getTags() {
        return this.blogService.getTags();
    }
    async getPopularTags() {
        return this.blogService.getPopularTags();
    }
    async getRecommendedPosts(limit = 5) {
        return this.blogService.getRecommendedPosts(Number(limit));
    }
    async getLatestPosts(limit = 5) {
        return this.blogService.getLatestPosts(Number(limit));
    }
    async likePost(id, req) {
        const userId = req.user.id;
        return this.blogService.toggleLike(Number(id), userId);
    }
    async getComments(id, query) {
        const { page = 1, limit = 10 } = query;
        return this.blogService.getComments(Number(id), {
            page: Number(page),
            limit: Number(limit)
        });
    }
    async addComment(id, data, req) {
        const userId = req.user.id;
        return this.blogService.addComment(Number(id), {
            ...data,
            authorId: userId
        });
    }
    async getArchive() {
        return this.blogService.getArchive();
    }
    async getSiteStats() {
        return this.blogService.getSiteStats();
    }
    async searchPosts(query) {
        const { q, page = 1, limit = 10 } = query;
        return this.blogService.searchPosts(q, {
            page: Number(page),
            limit: Number(limit)
        });
    }
    async getRelatedPosts(id, limit = 5) {
        return this.blogService.getRelatedPosts(Number(id), Number(limit));
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getPost", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('tags'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)('tags/popular'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getPopularTags", null);
__decorate([
    (0, common_1.Get)('posts/recommended'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getRecommendedPosts", null);
__decorate([
    (0, common_1.Get)('posts/latest'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getLatestPosts", null);
__decorate([
    (0, common_1.Post)('posts/:id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "likePost", null);
__decorate([
    (0, common_1.Get)('posts/:id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('posts/:id/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('archive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArchive", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getSiteStats", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "searchPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id/related'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getRelatedPosts", null);
exports.BlogController = BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map