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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, status, search, categoryId } = query;
        const where = {};
        if (status) {
            where.status = String(status).toUpperCase();
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { content: { contains: search } }
            ];
        }
        if (categoryId) {
            where.categoryId = Number(categoryId);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        console.log('查询条件:', { where, skip, take });
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, username: true, nickname: true }
                    },
                    category: {
                        select: { id: true, name: true }
                    },
                    tags: {
                        select: {
                            tag: { select: { id: true, name: true } }
                        }
                    }
                }
            }),
            this.prisma.post.count({ where })
        ]);
        console.log('查询结果:', { posts: posts.length, total });
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            summary: post.summary,
            coverImage: post.coverImage,
            publishedAt: post.publishedAt,
            viewCount: post.viewCount,
            likeCount: post.likeCount,
            author: post.author,
            category: post.category,
            tags: post.tags.map(pt => pt.tag),
            status: post.status,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));
        return {
            posts: formattedPosts,
            total,
            page: Number(page),
            limit: Number(limit)
        };
    }
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, username: true, nickname: true }
                },
                category: {
                    select: { id: true, name: true }
                },
                tags: {
                    select: {
                        tag: { select: { id: true, name: true } }
                    }
                }
            }
        });
        if (!post)
            return null;
        return {
            ...post,
            tags: post.tags.map(pt => pt.tag)
        };
    }
    async create(data) {
        const { userId, title, content, summary, coverImage, status, viewCount, likeCount, categoryId, publishedAt, tagIds } = data;
        if (!userId) {
            throw new Error('userId 不能为空');
        }
        const postData = {
            title,
            content,
            status: String(status).toUpperCase(),
            author: {
                connect: { id: userId }
            }
        };
        if (summary !== undefined)
            postData.summary = summary;
        if (coverImage !== undefined)
            postData.coverImage = coverImage;
        if (viewCount !== undefined)
            postData.viewCount = viewCount;
        if (likeCount !== undefined)
            postData.likeCount = likeCount;
        if (categoryId !== undefined && categoryId !== null) {
            postData.category = { connect: { id: categoryId } };
        }
        if (publishedAt !== undefined)
            postData.publishedAt = publishedAt;
        const post = await this.prisma.post.create({ data: postData });
        if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
            await this.prisma.postTag.createMany({
                data: tagIds.map((tagId) => ({
                    postId: post.id,
                    tagId
                }))
            });
        }
        return post;
    }
    async update(id, data) {
        const { title, content, summary, coverImage, status, viewCount, likeCount, categoryId, publishedAt, tagIds } = data;
        const postData = {
            title,
            content,
            status: String(status).toUpperCase(),
        };
        if (summary !== undefined)
            postData.summary = summary;
        if (coverImage !== undefined)
            postData.coverImage = coverImage;
        if (viewCount !== undefined)
            postData.viewCount = viewCount;
        if (likeCount !== undefined)
            postData.likeCount = likeCount;
        if (categoryId !== undefined && categoryId !== null) {
            postData.category = { connect: { id: categoryId } };
        }
        if (publishedAt !== undefined)
            postData.publishedAt = publishedAt;
        const post = await this.prisma.post.update({ where: { id }, data: postData });
        if (tagIds) {
            await this.prisma.postTag.deleteMany({ where: { postId: id } });
            if (Array.isArray(tagIds) && tagIds.length > 0) {
                await this.prisma.postTag.createMany({
                    data: tagIds.map((tagId) => ({
                        postId: id,
                        tagId
                    }))
                });
            }
        }
        return post;
    }
    async remove(id) {
        return this.prisma.post.delete({ where: { id } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map