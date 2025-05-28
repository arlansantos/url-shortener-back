import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('urls')
export class Url {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  originalUrl: string;

  @ApiProperty()
  @Column({ length: 6, unique: true })
  shortUrl: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
