import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

interface JobResult {
  companyName: string;
  careerUrl: string;
  roleName: string;
  source: string;
}

/** Well-known company slugs to query on public ATS board APIs */
const GREENHOUSE_COMPANIES = [
  'airbnb', 'cloudflare', 'figma', 'discord', 'hashicorp',
  'stripe', 'plaid', 'notion', 'databricks', 'airtable',
  'gitlab', 'twilio', 'brex', 'cockroachlabs', 'confluent',
  'datadog', 'elastic', 'grafanalabs', 'snyk', 'supabase',
];

const LEVER_COMPANIES = [
  'netflix', 'spotify', 'openai', 'anduril', 'rippling',
  'reddit', 'grammarly', 'coinbase', 'robinhood', 'verkada',
  'nerdwallet', 'samsara', 'faire', 'wealthfront', 'ironclad',
];

const ASHBY_COMPANIES = [
  'ramp', 'linear', 'vercel', 'resend', 'drata',
  'mercury', 'posthog', 'raycast', 'clerk', 'cal',
];

@Injectable()
export class JobDiscoveryService {
  private readonly logger = new Logger(JobDiscoveryService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /**
   * Discover jobs relevant to a candidate's preferred role(s) by querying
   * Adzuna, Greenhouse, Lever, and Ashby in parallel.
   * Persists new unique career links and returns the full feed.
   */
  async discoverForUser(userId: string, roleNameOverride?: string) {
    const preferences = await this.prisma.jobPreference.findMany({
      where: { userId },
    });

    const roleNames = roleNameOverride
      ? [roleNameOverride]
      : preferences.map((p) => p.roleName);

    if (roleNames.length === 0) {
      return { message: 'No job preferences set yet', links: [] };
    }

    // Search all sources in parallel for each role
    for (const roleName of roleNames) {
      const results = await this.searchAllSources(roleName);
      for (const result of results) {
        const existing = await this.prisma.careerLink.findFirst({
          where: { careerUrl: result.careerUrl, roleName: result.roleName },
        });
        if (existing) continue;

        await this.prisma.careerLink.create({
          data: {
            companyName: result.companyName,
            careerUrl: result.careerUrl,
            roleName: result.roleName,
            source: result.source,
          },
        });
      }
    }

    return this.getFeed(roleNames);
  }

  async getFeedForUser(userId: string, roleNameOverride?: string) {
    const preferences = await this.prisma.jobPreference.findMany({
      where: { userId },
    });

    const roleNames = roleNameOverride
      ? [roleNameOverride]
      : preferences.map((p) => p.roleName);

    if (roleNames.length === 0) {
      return [];
    }

    return this.getFeed(roleNames);
  }

  async getFeed(roleNames?: string[]) {
    return this.prisma.careerLink.findMany({
      where: roleNames?.length ? { roleName: { in: roleNames } } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        feedbacks: {
          select: {
            id: true,
            status: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  /** Queries all job sources in parallel and returns combined results */
  private async searchAllSources(roleName: string): Promise<JobResult[]> {
    const [adzunaResults, greenhouseResults, leverResults, ashbyResults] =
      await Promise.allSettled([
        this.searchAdzuna(roleName),
        this.searchGreenhouse(roleName),
        this.searchLever(roleName),
        this.searchAshby(roleName),
      ]);

    const results: JobResult[] = [];

    if (adzunaResults.status === 'fulfilled') results.push(...adzunaResults.value);
    else this.logger.warn('Adzuna search failed', adzunaResults.reason);

    if (greenhouseResults.status === 'fulfilled') results.push(...greenhouseResults.value);
    else this.logger.warn('Greenhouse search failed', greenhouseResults.reason);

    if (leverResults.status === 'fulfilled') results.push(...leverResults.value);
    else this.logger.warn('Lever search failed', leverResults.reason);

    if (ashbyResults.status === 'fulfilled') results.push(...ashbyResults.value);
    else this.logger.warn('Ashby search failed', ashbyResults.reason);

    this.logger.log(`Found ${results.length} total results for role "${roleName}"`);
    return results;
  }

  // ─── Adzuna ────────────────────────────────────────────────────────
  private async searchAdzuna(roleName: string): Promise<JobResult[]> {
    const appId = this.config.get<string>('ADZUNA_APP_ID');
    const apiKey = this.config.get<string>('ADZUNA_API_KEY');

    if (!appId || !apiKey) {
      this.logger.warn('ADZUNA_APP_ID / ADZUNA_API_KEY not set — skipping Adzuna.');
      return [];
    }

    try {
      const { data } = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/gb/search/1`,
        {
          params: {
            app_id: appId,
            app_key: apiKey,
            results_per_page: 10,
            what: roleName,
          },
          timeout: 10000,
        },
      );

      return (data.results ?? []).map((job: any) => ({
        companyName: job.company?.display_name ?? 'Unknown',
        careerUrl: job.redirect_url ?? job.url ?? '',
        roleName,
        source: 'adzuna',
      })).filter((r: JobResult) => r.careerUrl);
    } catch (err) {
      this.logger.error('Adzuna API call failed', (err as Error).message);
      return [];
    }
  }

  // ─── Greenhouse (public board API — no key needed) ─────────────────
  private async searchGreenhouse(roleName: string): Promise<JobResult[]> {
    const results: JobResult[] = [];
    const keyword = roleName.toLowerCase();

    const fetches = GREENHOUSE_COMPANIES.map(async (company) => {
      try {
        const { data } = await axios.get(
          `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`,
          { timeout: 8000 },
        );

        const jobs = (data.jobs ?? []).filter((job: any) =>
          job.title?.toLowerCase().includes(keyword),
        );

        for (const job of jobs.slice(0, 1)) {
          results.push({
            companyName: company,
            careerUrl: job.absolute_url ?? `https://boards.greenhouse.io/${company}/jobs/${job.id}`,
            roleName,
            source: 'greenhouse',
          });
        }
      } catch {
        // Silently skip companies whose boards are unavailable
      }
    });

    await Promise.allSettled(fetches);
    return results;
  }

  // ─── Lever (public postings API — no key needed) ───────────────────
  private async searchLever(roleName: string): Promise<JobResult[]> {
    const results: JobResult[] = [];
    const keyword = roleName.toLowerCase();

    const fetches = LEVER_COMPANIES.map(async (company) => {
      try {
        const { data } = await axios.get(
          `https://api.lever.co/v0/postings/${company}`,
          { timeout: 8000 },
        );

        const jobs = (data ?? []).filter((job: any) =>
          job.text?.toLowerCase().includes(keyword),
        );

        for (const job of jobs.slice(0, 1)) {
          results.push({
            companyName: company,
            careerUrl: job.hostedUrl ?? job.applyUrl ?? '',
            roleName,
            source: 'lever',
          });
        }
      } catch {
        // Silently skip companies whose boards are unavailable
      }
    });

    await Promise.allSettled(fetches);
    return results;
  }

  // ─── Ashby (public job board API — no key needed) ──────────────────
  private async searchAshby(roleName: string): Promise<JobResult[]> {
    const results: JobResult[] = [];
    const keyword = roleName.toLowerCase();

    const fetches = ASHBY_COMPANIES.map(async (company) => {
      try {
        const { data } = await axios.post(
          `https://api.ashbyhq.com/posting-api/job-board/${company}`,
          {},
          { timeout: 8000 },
        );

        const jobs = (data.jobs ?? []).filter((job: any) =>
          job.title?.toLowerCase().includes(keyword),
        );

        for (const job of jobs.slice(0, 1)) {
          results.push({
            companyName: company,
            careerUrl: job.jobUrl ?? `https://jobs.ashbyhq.com/${company}/${job.id}`,
            roleName,
            source: 'ashby',
          });
        }
      } catch {
        // Silently skip companies whose boards are unavailable
      }
    });

    await Promise.allSettled(fetches);
    return results;
  }
}
