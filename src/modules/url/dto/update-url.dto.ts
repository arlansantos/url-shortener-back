import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://www.youtube.com/' })
  originalUrl: string;
}
