import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { HrService } from './hr.service';
import { SearchCandidatesDto } from './dto/search-candidates.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @Get('candidates')
  @Roles(Role.HR)
  @ApiOperation({ summary: 'List / search candidates by skill or role' })
  listCandidates(@Query() dto: SearchCandidatesDto) {
    return this.hrService.listCandidates(dto);
  }

  @Get('candidates/:id')
  @Roles(Role.HR)
  @ApiOperation({ summary: 'View a candidate profile + resumes + AI insights' })
  getCandidate(@Param('id') id: string) {
    return this.hrService.getCandidateDetail(id);
  }

  @Post('messages')
  @Roles(Role.HR)
  @ApiOperation({ summary: 'Send a message to a candidate (max 3 per candidate)' })
  sendMessage(@CurrentUser('userId') hrId: string, @Body() dto: SendMessageDto) {
    return this.hrService.sendMessage(hrId, dto);
  }

  @Get('messages/:candidateId')
  @Roles(Role.HR)
  @ApiOperation({ summary: 'View messages this HR sent to a candidate' })
  getSentMessages(
    @CurrentUser('userId') hrId: string,
    @Param('candidateId') candidateId: string,
  ) {
    return this.hrService.getMessagesSentByHr(hrId, candidateId);
  }

  @Get('inbox/me')
  @Roles(Role.CANDIDATE)
  @ApiOperation({ summary: 'Candidate: view received HR messages' })
  getInbox(@CurrentUser('userId') candidateId: string) {
    return this.hrService.getMessagesForCandidate(candidateId);
  }
}
