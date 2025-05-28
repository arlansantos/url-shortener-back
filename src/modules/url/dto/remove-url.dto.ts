import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveUrlDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}
