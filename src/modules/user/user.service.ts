import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PageDto } from 'src/utils/dto/page.dto';
import { paginate } from 'src/utils/helpers/paginate';
import { IPaginateResult } from 'src/common/interfaces/paginate-result.interface';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, traceId: string): Promise<User> {
    this.logger.log(`[${traceId}] Criando usuário...`);

    await this.existsUser(createUserDto.email, traceId);

    const hashedPassword = await hash(createUserDto.password, 10);

    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(
    pageDto: PageDto,
    traceId: string,
  ): Promise<IPaginateResult<User>> {
    this.logger.log(`[${traceId}] Buscando todos os usuários...`);

    const query = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ])
      .where('user.deletedAt IS NULL');

    return await paginate<User>(query, 'user', pageDto);
  }

  async findOne(id: string, traceId: string): Promise<User> {
    this.logger.log(`[${traceId}] Buscando usuário com ID: ${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'deletedAt'],
      withDeleted: false,
    });

    if (!user) {
      this.logger.warn(`[${traceId}] Usuário com ID: ${id} não encontrado`);
      throw new NotFoundException(`Usuário com ID: ${id} não encontrado`);
    }

    return user;
  }

  async findOneByEmail(email: string, traceId: string): Promise<User | null> {
    this.logger.log(`[${traceId}] Buscando usuário com email: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    traceId: string,
  ): Promise<void> {
    this.logger.log(`[${traceId}] Atualizando usuário com ID: ${id}`);

    if (updateUserDto.email) {
      await this.existsUser(updateUserDto.email, traceId);
    }

    await this.findOne(id, traceId);

    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string, traceId: string): Promise<void> {
    this.logger.log(`[${traceId}] Removendo usuário com ID: ${id}`);

    await this.findOne(id, traceId);

    await this.userRepository.softDelete(id);
  }

  async existsUser(email: string, traceId: string): Promise<void> {
    this.logger.log(
      `[${traceId}] Verificando se usuário existe com email: ${email}`,
    );

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      this.logger.warn(`[${traceId}] Usuário com email ${email} já existe`);
      throw new BadRequestException(`Usuário com email ${email} já existe`);
    }
  }
}
