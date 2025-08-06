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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublishedPosts(options) {
        const { page, limit, category, tag, search, userId, myPosts } = options;
        let where = {};
        if (myPosts && userId) {
            where.authorId = userId;
        }
        else {
            where.status = 'PUBLISHED';
        }
        if (category) {
            where.category = { name: category };
        }
        if (tag) {
            where.tags = {
                some: {
                    tag: { name: tag }
                }
            };
        }
        if (search) {
            const searchConditions = [
                { title: { contains: search } },
                { summary: { contains: search } },
                { content: { contains: search } }
            ];
            if (where.OR) {
                where.AND = [
                    { OR: where.OR },
                    { OR: searchConditions }
                ];
                delete where.OR;
            }
            else {
                where.OR = searchConditions;
            }
        }
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, username: true, nickname: true, avatar: true }
                    },
                    category: {
                        select: { id: true, name: true }
                    },
                    tags: {
                        select: {
                            tag: { select: { id: true, name: true, color: true } }
                        }
                    },
                    _count: {
                        select: { comments: true, likes: true }
                    }
                }
            }),
            this.prisma.post.count({ where })
        ]);
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
            commentCount: post._count.comments,
            excerpt: post.summary || post.content.substring(0, 200) + '...',
            status: post.status,
            isOwnPost: userId ? post.author.id === userId : false
        }));
        return {
            posts: formattedPosts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getPostDetail(id, userId) {
        if (!id || isNaN(id)) {
            throw new Error('无效的文章ID');
        }
        const postId = Number(id);
        console.log('Updating view count for post ID:', postId);
        const existingPost = await this.prisma.post.findUnique({
            where: { id: postId }
        });
        if (!existingPost) {
            throw new Error('文章不存在');
        }
        const canAccess = existingPost.status === 'PUBLISHED' ||
            (userId && existingPost.authorId === userId);
        if (!canAccess) {
            throw new Error('文章不存在或无权限访问');
        }
        try {
            await this.prisma.post.update({
                where: { id: postId },
                data: { viewCount: { increment: 1 } }
            });
        }
        catch (error) {
            console.error('Failed to update view count for post ID:', postId, error);
        }
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: { id: true, username: true, nickname: true, avatar: true, bio: true }
                },
                category: {
                    select: { id: true, name: true }
                },
                tags: {
                    select: {
                        tag: { select: { id: true, name: true, color: true } }
                    }
                },
                _count: {
                    select: { comments: true, likes: true }
                }
            }
        });
        if (!post) {
            throw new Error('文章不存在');
        }
        let isLiked = false;
        if (userId) {
            const like = await this.prisma.like.findUnique({
                where: {
                    userId_postId: { userId, postId: postId }
                }
            });
            isLiked = !!like;
        }
        return {
            ...post,
            tags: post.tags.map(pt => pt.tag),
            commentCount: post._count.comments,
            isLiked,
            isOwnPost: userId ? post.author.id === userId : false
        };
    }
    async getCategories() {
        const categories = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: { posts: { where: { status: 'PUBLISHED' } } }
                }
            },
            orderBy: { sort: 'asc' }
        });
        return categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            postCount: category._count.posts
        }));
    }
    async getTags() {
        const tags = await this.prisma.tag.findMany({
            include: {
                _count: {
                    select: { posts: { where: { post: { status: 'PUBLISHED' } } } }
                }
            }
        });
        return tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
            postCount: tag._count.posts
        }));
    }
    async getPopularTags(limit = 10) {
        const tags = await this.prisma.tag.findMany({
            include: {
                _count: {
                    select: { posts: { where: { post: { status: 'PUBLISHED' } } } }
                }
            },
            orderBy: {
                posts: { _count: 'desc' }
            },
            take: limit
        });
        return tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
            postCount: tag._count.posts
        }));
    }
    async getRecommendedPosts(limit = 5) {
        const posts = await this.prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: [
                { likeCount: 'desc' },
                { viewCount: 'desc' }
            ],
            take: limit,
            include: {
                author: {
                    select: { id: true, username: true, nickname: true }
                },
                category: {
                    select: { id: true, name: true }
                }
            }
        });
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            summary: post.summary,
            excerpt: post.summary,
            publishedAt: post.publishedAt,
            viewCount: post.viewCount,
            likeCount: post.likeCount || 0,
            author: post.author,
            category: post.category
        }));
    }
    async getLatestPosts(limit = 5) {
        console.log('Getting latest posts with limit:', limit);
        const posts = await this.prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' },
            take: limit,
            include: {
                author: {
                    select: { id: true, username: true, nickname: true }
                },
                category: {
                    select: { id: true, name: true }
                }
            }
        });
        console.log('Found posts:', posts.length, 'posts:', posts.map(p => ({ id: p.id, title: p.title })));
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            summary: post.summary,
            excerpt: post.summary,
            publishedAt: post.publishedAt,
            viewCount: post.viewCount,
            likeCount: post.likeCount || 0,
            author: post.author,
            category: post.category
        }));
    }
    async toggleLike(postId, userId) {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });
        if (existingLike) {
            await this.prisma.like.delete({
                where: { id: existingLike.id }
            });
            await this.prisma.post.update({
                where: { id: postId },
                data: { likeCount: { decrement: 1 } }
            });
            return { liked: false, message: '取消点赞成功' };
        }
        else {
            await this.prisma.like.create({
                data: { userId, postId }
            });
            await this.prisma.post.update({
                where: { id: postId },
                data: { likeCount: { increment: 1 } }
            });
            return { liked: true, message: '点赞成功' };
        }
    }
    async getComments(postId, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: { postId, status: 'APPROVED', parentId: null },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, username: true, nickname: true, avatar: true }
                    },
                    replies: {
                        include: {
                            author: {
                                select: { id: true, username: true, nickname: true, avatar: true }
                            }
                        },
                        orderBy: { createdAt: 'asc' }
                    }
                }
            }),
            this.prisma.comment.count({
                where: { postId, status: 'APPROVED', parentId: null }
            })
        ]);
        return {
            comments,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async addComment(postId, data) {
        const comment = await this.prisma.comment.create({
            data: {
                content: data.content,
                postId,
                authorId: data.authorId,
                parentId: data.parentId
            },
            include: {
                author: {
                    select: { id: true, username: true, nickname: true, avatar: true }
                }
            }
        });
        return comment;
    }
    async getArchive() {
        const result = await this.prisma.post.groupBy({
            by: ['publishedAt'],
            where: { status: 'PUBLISHED' },
            _count: { id: true },
            orderBy: { publishedAt: 'desc' }
        });
        const archive = {};
        result.forEach(item => {
            if (item.publishedAt) {
                const date = new Date(item.publishedAt);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                if (!archive[year]) {
                    archive[year] = {};
                }
                if (!archive[year][month]) {
                    archive[year][month] = 0;
                }
                archive[year][month] += item._count.id;
            }
        });
        return archive;
    }
    async getSiteStats() {
        const [postCount, categoryCount, tagCount, commentCount] = await Promise.all([
            this.prisma.post.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.category.count(),
            this.prisma.tag.count(),
            this.prisma.comment.count({ where: { status: 'APPROVED' } })
        ]);
        const totalViews = await this.prisma.post.aggregate({
            where: { status: 'PUBLISHED' },
            _sum: { viewCount: true }
        });
        return {
            postCount,
            categoryCount,
            tagCount,
            commentCount,
            totalViews: totalViews._sum.viewCount || 0
        };
    }
    async searchPosts(query, options) {
        if (!query) {
            return { posts: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = {
            status: 'PUBLISHED',
            OR: [
                { title: { contains: query } },
                { summary: { contains: query } },
                { content: { contains: query } }
            ]
        };
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, username: true, nickname: true }
                    },
                    category: {
                        select: { id: true, name: true }
                    },
                    tags: {
                        select: {
                            tag: { select: { id: true, name: true, color: true } }
                        }
                    }
                }
            }),
            this.prisma.post.count({ where })
        ]);
        return {
            posts: posts.map(post => ({
                id: post.id,
                title: post.title,
                summary: post.summary,
                publishedAt: post.publishedAt,
                viewCount: post.viewCount,
                likeCount: post.likeCount,
                author: post.author,
                category: post.category,
                tags: post.tags.map(pt => pt.tag)
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getRelatedPosts(postId, limit = 5) {
        const currentPost = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                tags: { select: { tagId: true } },
                category: { select: { id: true } }
            }
        });
        if (!currentPost) {
            return [];
        }
        const tagIds = currentPost.tags.map(pt => pt.tagId);
        const relatedPosts = await this.prisma.post.findMany({
            where: {
                id: { not: postId },
                status: 'PUBLISHED',
                OR: [
                    {
                        tags: {
                            some: {
                                tagId: { in: tagIds }
                            }
                        }
                    },
                    {
                        categoryId: currentPost.categoryId
                    }
                ]
            },
            take: limit,
            orderBy: [
                { likeCount: 'desc' },
                { viewCount: 'desc' }
            ],
            include: {
                author: {
                    select: { id: true, username: true, nickname: true }
                },
                category: {
                    select: { id: true, name: true }
                }
            }
        });
        return relatedPosts.map(post => ({
            id: post.id,
            title: post.title,
            summary: post.summary,
            publishedAt: post.publishedAt,
            viewCount: post.viewCount,
            author: post.author,
            category: post.category
        }));
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map