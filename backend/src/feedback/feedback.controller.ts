import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Add feedback for a career link' })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(userId, dto);
  }

  @Get('mine')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: "Get current candidate's own feedback" })
  findMine(@CurrentUser('userId') userId: string) {
    return this.feedbackService.findMine(userId);
  }

  @Get('career-link/:id')
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'View all community feedback for a career link' })
  findByCareerLink(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.feedbackService.findByCareerLink(id, pagination.page, pagination.limit);
  }

  @Get()
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'View all feedback (paginated)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.feedbackService.findAll(pagination.page, pagination.limit);
  }
}
