import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { ResumeService } from './resume.service';
import { resumeMulterOptions } from './multer.config';

@ApiTags('resume')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Upload resume (PDF/DOCX) and run Gemini analysis' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', resumeMulterOptions))
  async upload(@CurrentUser('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Resume file is required');
    return this.resumeService.uploadAndAnalyze(userId, file);
  }

  @Get('me')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'List my resumes' })
  getMine(@CurrentUser('userId') userId: string) {
    return this.resumeService.getMyResumes(userId);
  }

  @Get(':id')
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'Get resume by id (owner or HR)' })
  getById(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.resumeService.getResumeById(userId, id, role);
  }
}
