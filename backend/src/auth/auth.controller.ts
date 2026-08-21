import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('candidate/register')
  @ApiOperation({ summary: 'Register a new candidate' })
  registerCandidate(@Body() dto: RegisterDto) {
    return this.authService.register(dto, Role.CANDIDATE);
  }

  @Post('candidate/login')
  @ApiOperation({ summary: 'Candidate login' })
  loginCandidate(@Body() dto: LoginDto) {
    return this.authService.login(dto, Role.CANDIDATE);
  }

  @Post('hr/register')
  @ApiOperation({ summary: 'Register a new HR user' })
  registerHr(@Body() dto: RegisterDto) {
    return this.authService.register(dto, Role.HR);
  }

  @Post('hr/login')
  @ApiOperation({ summary: 'HR login' })
  loginHr(@Body() dto: LoginDto) {
    return this.authService.login(dto, Role.HR);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate access/refresh tokens' })
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const user = req.user as { userId: string; refreshToken: string };
    return this.authService.refresh(user.userId, dto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
