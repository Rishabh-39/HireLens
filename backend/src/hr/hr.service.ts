import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { SearchCandidatesDto } from './dto/search-candidates.dto';
import { SendMessageDto } from './dto/send-message.dto';

const MAX_MESSAGES_PER_CANDIDATE = 3;

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async listCandidates(dto: SearchCandidatesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const where: any = { role: Role.CANDIDATE };

    if (dto.skill) {
      where.resumes = { some: { skills: { has: dto.skill } } };
    }
    if (dto.role) {
      where.jobPreferences = { some: { roleName: { contains: dto.role, mode: 'insensitive' } } };
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          jobPreferences: true,
          resumes: {
            select: { id: true, skills: true, technologies: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCandidateDetail(candidateId: string) {
    const candidate = await this.prisma.user.findFirst({
      where: { id: candidateId, role: Role.CANDIDATE },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        jobPreferences: true,
        resumes: true,
      },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async sendMessage(hrId: string, dto: SendMessageDto) {
    const candidate = await this.prisma.user.findFirst({
      where: { id: dto.candidateId, role: Role.CANDIDATE },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    const count = await this.prisma.hRMessage.count({
      where: { hrId, candidateId: dto.candidateId },
    });
    if (count >= MAX_MESSAGES_PER_CANDIDATE) {
      throw new BadRequestException(
        `Maximum of ${MAX_MESSAGES_PER_CANDIDATE} messages per candidate reached`,
      );
    }

    return this.prisma.hRMessage.create({
      data: { hrId, candidateId: dto.candidateId, message: dto.message },
    });
  }

  async getMessagesForCandidate(candidateId: string) {
    return this.prisma.hRMessage.findMany({
      where: { candidateId },
      include: { hr: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMessagesSentByHr(hrId: string, candidateId: string) {
    return this.prisma.hRMessage.findMany({
      where: { hrId, candidateId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
