import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  careerLinkId: string;

  @ApiProperty({ enum: FeedbackStatus })
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @ApiPropertyOptional({ example: 'Recruiter replied within 2 days' })
  @IsOptional()
  @IsString()
  comment?: string;
}
