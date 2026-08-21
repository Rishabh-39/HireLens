import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [MulterModule.register(), AiModule],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
