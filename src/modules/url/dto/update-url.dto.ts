import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://www.youtube.com/' })
  originalUrl: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}
