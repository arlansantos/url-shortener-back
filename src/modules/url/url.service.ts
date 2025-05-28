import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginateResult } from 'src/common/interfaces/paginate-result.interface';
import { PageDto } from 'src/utils/dto/page.dto';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { paginate } from 'src/utils/helpers/paginate';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortCode } from 'src/utils/helpers/generate-short-code';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { RemoveUrlDto } from './dto/remove-url.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly userService: UserService,
  ) {}

  async shortenUrl(
    shortenUrlDto: ShortenUrlDto,
    traceId: string,
  ): Promise<string> {
    this.logger.log(
      `[${traceId}] Encurtando a url: ${shortenUrlDto.originalUrl}`,
    );

    let shortCode = '';

    do {
      shortCode = generateShortCode();
    } while (await this.findOneByShortUrl(shortCode, traceId));

    let user = new User();

    if (shortenUrlDto.userId) {
      this.logger.log(
        `[${traceId}] Associando a URL encurtada ao usuário: ${shortenUrlDto.userId}`,
      );
      user = await this.userService.findOne(shortenUrlDto.userId, traceId);
    }

    const url = this.urlRepository.create({
      originalUrl: shortenUrlDto.originalUrl,
      shortUrl: shortCode,
      user: user || null,
    });

    await this.urlRepository.save(url);

    return process.env.BASE_URL + url.shortUrl;
  }

  async redirect(shortUrl: string, traceId: string): Promise<string> {
    const url = await this.findOneByShortUrl(shortUrl, traceId);

    if (!url) {
      this.logger.warn(`[${traceId}] Url encurtada não encontrada`);
      throw new NotFoundException(`Url encurtada  não encontrada`);
    }

    await this.urlRepository.increment({ id: url.id }, 'clickCount', 1);

    this.logger.log(`[${traceId}] Redirecionando para: ${url.originalUrl}`);

    return url.originalUrl;
  }

  async findAllByUserId(
    userId: string,
    pageDto: PageDto,
    traceId: string,
  ): Promise<IPaginateResult<Url>> {
    this.logger.log(
      `[${traceId}] Buscando todos os urls do usuário: ${userId}`,
    );
    console.log(userId);
    const query = this.urlRepository
      .createQueryBuilder('url')
      .leftJoin('url.user', 'user')
      .where('url.deletedAt IS NULL')
      .andWhere('user.id = :userId', { userId });

    return await paginate<Url>(query, 'url', pageDto);
  }

  async findOne(id: string, traceId: string): Promise<Url> {
    this.logger.log(`[${traceId}] Buscando url com ID: ${id}`);

    const url = await this.urlRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: false,
    });

    if (!url) {
      this.logger.warn(`[${traceId}] Url com ID: ${id} não encontrado`);
      throw new NotFoundException(`Url com ID: ${id} não encontrado`);
    }

    return url;
  }

  async findOneByShortUrl(
    shortUrl: string,
    traceId: string,
  ): Promise<Url | null> {
    this.logger.log(
      `[${traceId}] Buscando url encurtada com shortUrl: ${shortUrl}`,
    );

    const url = await this.urlRepository.findOne({
      where: { shortUrl },
      withDeleted: true,
    });

    return url;
  }

  async update(
    id: string,
    updateUrlDto: UpdateUrlDto,
    traceId: string,
  ): Promise<void> {
    const url = await this.findOne(id, traceId);

    if (!(updateUrlDto.userId === url.user?.id)) {
      this.logger.warn(
        `[${traceId}] Usuário não autorizado a atualizar esta URL`,
      );
      throw new UnauthorizedException(
        `Usuário não autorizado a atualizar esta URL`,
      );
    }

    this.logger.log(`[${traceId}] Atualizando url de destino com ID: ${id}`);

    await this.urlRepository.update(id, {
      originalUrl: updateUrlDto.originalUrl,
    });
  }

  async remove(
    id: string,
    removeUrlDto: RemoveUrlDto,
    traceId: string,
  ): Promise<void> {
    const url = await this.findOne(id, traceId);

    if (!(removeUrlDto.userId === url.user?.id)) {
      this.logger.warn(
        `[${traceId}] Usuário não autorizado a deletar esta URL`,
      );
      throw new UnauthorizedException(
        `Usuário não autorizado a deletar esta URL`,
      );
    }

    this.logger.log(`[${traceId}] Deletando url com ID: ${id}`);

    await this.urlRepository.softDelete(id);
  }
}
