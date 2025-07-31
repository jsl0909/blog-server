import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, status, search, categoryId } = query;
    const where: any = {};
    
    // 状态过滤
    if (status) {
      where.status = String(status).toUpperCase();
    }
    
    // 搜索过滤
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ];
    }
    
    // 分类过滤
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
    
    // 格式化返回，确保有 status 字段
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
      status: post.status, // 保证有 status 字段
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

  async findOne(id: number) {
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
    if (!post) return null;
    // tags 字段统一为 [{id, name}]
    return {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    };
  }

  async create(data: any) {
    const {
      userId,
      title,
      content,
      summary,
      coverImage,
      status,
      viewCount,
      likeCount,
      categoryId,
      publishedAt,
      tagIds // 这里是 tagIds
    } = data;
    if (!userId) {
      throw new Error('userId 不能为空');
    }
    const postData: any = {
      title,
      content,
      status: String(status).toUpperCase(),
      author: {
        connect: { id: userId }
      }
    };
    if (summary !== undefined) postData.summary = summary;
    if (coverImage !== undefined) postData.coverImage = coverImage;
    if (viewCount !== undefined) postData.viewCount = viewCount;
    if (likeCount !== undefined) postData.likeCount = likeCount;
    if (categoryId !== undefined && categoryId !== null) {
      postData.category = { connect: { id: categoryId } };
    }
    if (publishedAt !== undefined) postData.publishedAt = publishedAt;

    // 1. 先创建文章
    const post = await this.prisma.post.create({ data: postData });

    // 2. 再批量插入 post_tags 关联
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      await this.prisma.postTag.createMany({
        data: tagIds.map((tagId: number) => ({
          postId: post.id,
          tagId
        }))
      });
    }
    return post;
  }

  async update(id: number, data: any) {
    const {
      title,
      content,
      summary,
      coverImage,
      status,
      viewCount,
      likeCount,
      categoryId,
      publishedAt,
      tagIds // 新标签id数组
    } = data;

    const postData: any = {
      title,
      content,
      status: String(status).toUpperCase(),
    };
    if (summary !== undefined) postData.summary = summary;
    if (coverImage !== undefined) postData.coverImage = coverImage;
    if (viewCount !== undefined) postData.viewCount = viewCount;
    if (likeCount !== undefined) postData.likeCount = likeCount;
    if (categoryId !== undefined && categoryId !== null) {
      postData.category = { connect: { id: categoryId } };
    }
    if (publishedAt !== undefined) postData.publishedAt = publishedAt;

    // 1. 更新主表
    const post = await this.prisma.post.update({ where: { id }, data: postData });

    // 2. 处理标签关联
    if (tagIds) {
      // 先删除所有旧关联
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
      // 再插入新关联
      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await this.prisma.postTag.createMany({
          data: tagIds.map((tagId: number) => ({
            postId: id,
            tagId
          }))
        });
      }
    }

    return post;
  }

  async remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
} 