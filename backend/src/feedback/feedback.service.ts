import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFeedbackDto) {
    const careerLink = await this.prisma.careerLink.findUnique({
      where: { id: dto.careerLinkId },
    });
    if (!careerLink) throw new NotFoundException('Career link not found');

    return this.prisma.feedback.create({
      data: {
        userId,
        careerLinkId: dto.careerLinkId,
        status: dto.status,
        comment: dto.comment,
      },
    });
  }

  async findByCareerLink(careerLinkId: string, page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { careerLinkId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.feedback.count({ where: { careerLinkId } }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findMine(userId: string) {
    return this.prisma.feedback.findMany({
      where: { userId },
      include: { careerLink: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.feedback.findMany({
        include: {
          user: { select: { id: true, name: true } },
          careerLink: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.feedback.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
