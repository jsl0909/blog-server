import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // 获取文章列表（支持权限隔离）
  async getPublishedPosts(options: {
    page: number;
    limit: number;
    category?: string;
    tag?: string;
    search?: string;
    userId?: number; // 添加用户ID参数
  }) {
    const { page, limit, category, tag, search, userId } = options;
    
    // 构建查询条件：已发布的文章 + 用户自己的文章（包括未发布的）
    const where: any = {
      OR: [
        { status: 'PUBLISHED' }, // 已发布的文章
        ...(userId ? [{ authorId: userId }] : []) // 用户自己的文章（包括未发布的）
      ]
    };

    // 分类过滤
    if (category) {
      where.category = { name: category };
    }

    // 标签过滤
    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag }
        }
      };
    }

    // 搜索过滤
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } }
      ];
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

    // 格式化返回数据
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
      status: post.status, // 添加状态字段
      isOwnPost: userId ? post.author.id === userId : false // 添加是否为自己的文章标识
    }));

    return {
      posts: formattedPosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // 获取文章详情（支持权限隔离）
  async getPostDetail(id: number, userId?: number) {
    // 验证id参数
    if (!id || isNaN(id)) {
      throw new Error('无效的文章ID');
    }

    const postId = Number(id);
    console.log('Updating view count for post ID:', postId);

    // 首先检查文章是否存在
    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      throw new Error('文章不存在');
    }

    // 检查访问权限：已发布的文章或用户自己的文章
    const canAccess = existingPost.status === 'PUBLISHED' || 
                     (userId && existingPost.authorId === userId);
    
    if (!canAccess) {
      throw new Error('文章不存在或无权限访问');
    }

    try {
      // 增加浏览量
      await this.prisma.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } }
      });
    } catch (error) {
      console.error('Failed to update view count for post ID:', postId, error);
      // 如果更新失败，继续执行，不中断整个流程
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

    // 检查用户是否已点赞
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
      isOwnPost: userId ? post.author.id === userId : false // 添加是否为自己的文章标识
    };
  }

  // 获取分类列表
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

  // 获取标签列表
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

  // 获取热门标签
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

  // 获取推荐文章
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
      excerpt: post.summary, // 添加excerpt字段，使用summary作为摘要
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount || 0,
      author: post.author,
      category: post.category
    }));
  }

  // 获取最新文章
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
      excerpt: post.summary, // 添加excerpt字段，使用summary作为摘要
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount || 0, // 添加likeCount字段
      author: post.author,
      category: post.category
    }));
  }

  // 切换点赞状态
  async toggleLike(postId: number, userId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existingLike) {
      // 取消点赞
      await this.prisma.like.delete({
        where: { id: existingLike.id }
      });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } }
      });
      return { liked: false, message: '取消点赞成功' };
    } else {
      // 添加点赞
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

  // 获取文章评论
  async getComments(postId: number, options: { page: number; limit: number }) {
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

  // 添加评论
  async addComment(postId: number, data: {
    content: string;
    authorId: number;
    parentId?: number;
  }) {
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

  // 获取归档信息
  async getArchive() {
    const result = await this.prisma.post.groupBy({
      by: ['publishedAt'],
      where: { status: 'PUBLISHED' },
      _count: { id: true },
      orderBy: { publishedAt: 'desc' }
    });

    // 按年月分组
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

  // 站点统计信息
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

  // 搜索文章
  async searchPosts(query: string, options: { page: number; limit: number }) {
    if (!query) {
      return { posts: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }

    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: 'PUBLISHED' as const,
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

  // 获取相关文章
  async getRelatedPosts(postId: number, limit = 5) {
    // 获取当前文章的标签
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

    // 查找相关文章
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
} 