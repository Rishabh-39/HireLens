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
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey.trim().length > 0) {
      this.genAI = new GoogleGenerativeAI(apiKey.trim());
      this.logger.log('Gemini AI initialized successfully.');
    } else {
      this.logger.warn('GEMINI_API_KEY not set — AI analysis will use fallback stub.');
    }
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    if (!this.genAI) {
      this.logger.warn('Gemini AI not initialized, returning fallback analysis.');
      return this.fallbackAnalysis();
    }

    if (!resumeText || resumeText.trim().length < 20) {
      this.logger.warn(
        `Resume text is too short or empty (length: ${resumeText?.length ?? 0}). ` +
        `The PDF/DOCX text extraction may have failed. Returning fallback.`,
      );
      return this.fallbackAnalysis();
    }

    this.logger.log(`Analyzing resume text (${resumeText.length} chars)...`);

    try {
      const modelName = this.config.get<string>('GEMINI_MODEL') ?? 'gemini-3.6-flash';
      this.logger.log(`Using Gemini model: ${modelName}`);

      const model = this.genAI.getGenerativeModel({ model: modelName });

      const prompt = `You are an expert resume parser and skill extractor. Your task is to carefully analyze the following resume text and extract ALL information.

IMPORTANT: You MUST return ONLY valid JSON with NO markdown fences, NO backticks, NO preamble text, NO explanation. Just the raw JSON object.

The JSON must match this exact structure:
{
  "skills": ["skill1", "skill2", ...],
  "education": [{"degree": "...", "institution": "...", "year": "..."}],
  "experience": [{"title": "...", "company": "...", "duration": "...", "summary": "..."}],
  "technologies": ["tech1", "tech2", ...]
}

Rules for extraction:
- "skills": Extract ALL skills mentioned anywhere in the resume — technical skills, soft skills, tools, frameworks, methodologies, certifications, and domain knowledge. Be thorough and include every skill you can find.
- "technologies": Extract all programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, and other technical tools mentioned.
- "education": Extract all educational qualifications with degree name, institution name, and graduation year.
- "experience": Extract all work experiences with job title, company name, duration, and a brief summary of responsibilities.
- If a field has no data, use an empty array [].
- Do NOT leave any skills or technologies out. Be comprehensive.

Resume text:
"""
${resumeText.slice(0, 15000)}
"""`;

      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();

      this.logger.log(`Gemini raw response (first 500 chars): ${raw.slice(0, 500)}`);

      // Clean the response: strip markdown fences and any leading/trailing non-JSON content
      let cleaned = raw;
      // Remove ```json ... ``` or ``` ... ``` blocks
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
      // Also handle cases where the response starts with text before the JSON
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      this.logger.log(`Cleaned JSON (first 500 chars): ${cleaned.slice(0, 500)}`);

      const parsed = JSON.parse(cleaned);

      const analysis: ResumeAnalysis = {
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        technologies: Array.isArray(parsed.technologies) ? parsed.technologies : [],
      };

      this.logger.log(
        `Resume analysis complete: ${analysis.skills.length} skills, ` +
        `${analysis.technologies.length} technologies, ` +
        `${analysis.education.length} education entries, ` +
        `${analysis.experience.length} experience entries.`,
      );

      return analysis;
    } catch (err) {
      this.logger.error('Gemini resume analysis failed:', (err as Error)?.message ?? err);
      this.logger.error('Full error:', err);
      // Re-throw so the caller (resume.service) can log and handle it
      throw err;
    }
  }

  private fallbackAnalysis(): ResumeAnalysis {
    return { skills: [], education: [], experience: [], technologies: [] };
  }
}
