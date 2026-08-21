import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class JobPreferencesDto {
  @ApiProperty({ example: ['Frontend Developer', 'Full Stack Developer'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles: string[];
}
