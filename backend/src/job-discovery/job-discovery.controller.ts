import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { JobDiscoveryService } from './job-discovery.service';
import { DiscoverDto } from './dto/discover.dto';

@ApiTags('job-discovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-discovery')
export class JobDiscoveryController {
  constructor(private jobDiscoveryService: JobDiscoveryService) {}

  @Post('search')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Search the web for career pages matching preferences + skills' })
  discover(@CurrentUser('userId') userId: string, @Query() query: DiscoverDto) {
    return this.jobDiscoveryService.discoverForUser(userId, query.roleName);
  }

  @Get('feed')
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'Get the career link feed' })
  getFeed(@CurrentUser('userId') userId: string, @Query('roleName') roleName?: string) {
    return this.jobDiscoveryService.getFeedForUser(userId, roleName);
  }
}
