import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Url } from '../entities/url.entity';

export class FindAllUrlResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: Url, isArray: true })
  @Type(() => Url)
  data: Url[];
}
