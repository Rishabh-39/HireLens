import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResumeModule } from './resume/resume.module';
import { AiModule } from './ai/ai.module';
import { JobDiscoveryModule } from './job-discovery/job-discovery.module';
import { FeedbackModule } from './feedback/feedback.module';
import { HrModule } from './hr/hr.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ResumeModule,
    AiModule,
    JobDiscoveryModule,
    FeedbackModule,
    HrModule,
  ],
})
export class AppModule {}
