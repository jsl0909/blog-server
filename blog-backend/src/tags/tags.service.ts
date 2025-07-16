import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany();
  }

  async findOne(id: number) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.tag.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.tag.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
} 