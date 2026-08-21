import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JobPreferencesDto } from './dto/job-preferences.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @Roles(Role.CANDIDATE, Role.HR)
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@CurrentUser('userId') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('me/job-preferences')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Set preferred job role(s) for candidate' })
  setJobPreferences(@CurrentUser('userId') userId: string, @Body() dto: JobPreferencesDto) {
    return this.usersService.setJobPreferences(userId, dto.roles);
  }
}
