import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return this.prisma.category.findUnique({ where: { name } });
  }

  async create(data: any) {
    return this.prisma.category.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
} 