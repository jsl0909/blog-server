import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [postCount, userCount, commentCount, categoryCount] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.user.count(),
      this.prisma.comment.count(),
      this.prisma.category.count(),
    ]);

    return {
      postCount,
      userCount,
      commentCount,
      categoryCount,
    };
  }
} 