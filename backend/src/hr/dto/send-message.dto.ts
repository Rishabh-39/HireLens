import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  candidateId: string;

  @ApiProperty({ example: 'Hi! We loved your profile, would you like to chat?' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  message: string;
}
