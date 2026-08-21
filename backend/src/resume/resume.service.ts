import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { extractTextFromFile } from './resume-parser.util';

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async uploadAndAnalyze(userId: string, file: Express.Multer.File) {
    const resume = await this.prisma.resume.create({
      data: {
        userId,
        fileUrl: `/uploads/resumes/${file.filename}`,
        fileName: file.originalname,
        mimeType: file.mimetype,
        status: 'PENDING',
      },
    });

    // Fire analysis (kept synchronous here for simplicity/predictability;
    // swap for a queue/worker in production for large files).
    try {
      const text = await extractTextFromFile(file.path, file.mimetype);
      const analysis = await this.aiService.analyzeResume(text);

      return this.prisma.resume.update({
        where: { id: resume.id },
        data: {
          extractedData: analysis as any,
          skills: analysis.skills,
          technologies: analysis.technologies,
          education: analysis.education as any,
          experience: analysis.experience as any,
          status: 'PROCESSED',
        },
      });
    } catch {
      return this.prisma.resume.update({
        where: { id: resume.id },
        data: { status: 'FAILED' },
      });
    }
  }

  async getMyResumes(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResumeById(userId: string, id: string, requesterRole: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId && requesterRole !== 'HR') {
      throw new ForbiddenException('Not allowed to view this resume');
    }
    return resume;
  }
}
