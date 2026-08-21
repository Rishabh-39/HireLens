import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchCandidatesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by skill keyword' })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({ description: 'Filter by preferred job role' })
  @IsOptional()
  @IsString()
  role?: string;
}
