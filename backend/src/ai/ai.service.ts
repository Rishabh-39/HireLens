import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ResumeAnalysis {
  skills: string[];
  education: { degree: string; institution: string; year?: string }[];
  experience: { title: string; company: string; duration?: string; summary?: string }[];
  technologies: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not set — AI analysis will use fallback stub.');
    }
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    if (!this.genAI) {
      return this.fallbackAnalysis();
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.config.get<string>('GEMINI_MODEL') ?? 'gemini-1.5-flash',
      });

      const prompt = `You are a resume parser. Analyze the following resume text and return ONLY valid JSON
(no markdown fences, no preamble) matching exactly this shape:
{
  "skills": string[],
  "education": [{ "degree": string, "institution": string, "year": string }],
  "experience": [{ "title": string, "company": string, "duration": string, "summary": string }],
  "technologies": string[]
}

Resume text:
"""${resumeText.slice(0, 15000)}"""`;

      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        skills: parsed.skills ?? [],
        education: parsed.education ?? [],
        experience: parsed.experience ?? [],
        technologies: parsed.technologies ?? [],
      };
    } catch (err) {
      this.logger.error('Gemini resume analysis failed, using fallback', err as Error);
      return this.fallbackAnalysis();
    }
  }

  private fallbackAnalysis(): ResumeAnalysis {
    return { skills: [], education: [], experience: [], technologies: [] };
  }
}
