import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { extractTextFromFile } from './resume-parser.util';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async uploadAndAnalyze(userId: string, file: Express.Multer.File) {
    this.logger.log(`Uploading resume for user ${userId}: ${file.originalname} (${file.mimetype})`);

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
      this.logger.log(`Extracting text from file: ${file.path}`);
      const text = await extractTextFromFile(file.path, file.mimetype);
      this.logger.log(`Extracted text length: ${text?.length ?? 0} chars`);

      if (!text || text.trim().length < 10) {
        this.logger.warn(`Text extraction returned very little content. Raw text: "${text?.slice(0, 200)}"`);
      } else {
        this.logger.log(`Text preview (first 200 chars): "${text.slice(0, 200)}"`);
      }

      const analysis = await this.aiService.analyzeResume(text);

      this.logger.log(`Analysis result — skills: [${analysis.skills.join(', ')}]`);
      this.logger.log(`Analysis result — technologies: [${analysis.technologies.join(', ')}]`);

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
    } catch (err) {
      this.logger.error(`Resume analysis failed for resume ${resume.id}:`, (err as Error)?.message ?? err);
      this.logger.error('Stack trace:', (err as Error)?.stack);
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

