import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Type } from 'class-transformer';

export class FindAllUserResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: User, isArray: true })
  @Type(() => User)
  data: User[];
}
