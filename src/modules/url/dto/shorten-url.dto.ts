import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @ApiProperty({
    example: 'https://www.youtube.com/',
    description: 'URL de origem que será encurtada',
  })
  @IsUrl()
  originalUrl: string;
}
