import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.comment.findMany();
  }

  async findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.comment.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
} 