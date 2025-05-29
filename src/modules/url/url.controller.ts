import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UrlService } from './url.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginateResult } from 'src/common/interfaces/paginate-result.interface';
import { Url } from './entities/url.entity';
import { PageDto } from 'src/utils/dto/page.dto';
import { IRequestWithTrace } from 'src/common/interfaces/request-with-trace.interface';
import { FindAllUrlResponseDto } from './dto/find-all-url-response.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { RemoveUrlDto } from './dto/remove-url.dto';
import { Optional } from 'src/common/decorators/optional.decorator';

@ApiBearerAuth()
@ApiTags('Url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Optional()
  @Post('shorten')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar uma url encurtada',
  })
  @ApiResponse({
    status: 201,
    description: 'Url encurtada criada com sucesso',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  async shortenUrl(
    @Body() shortenUrlDto: ShortenUrlDto,
    @Request() req: IRequestWithTrace,
  ): Promise<string> {
    const traceId = req.traceId;
    const userId = req.user?.sub || null;
    return await this.urlService.shortenUrl(shortenUrlDto, traceId, userId);
  }

  @Get('all/:userId')
  @ApiOperation({
    summary: 'Listar todas as urls',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de urls',
    type: [FindAllUrlResponseDto],
  })
  async findAll(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() pageDto: PageDto,
    @Request() req: IRequestWithTrace,
  ): Promise<IPaginateResult<Url>> {
    const traceId = req.traceId;
    return await this.urlService.findAllByUserId(userId, pageDto, traceId);
  }

  @ApiOperation({
    summary: 'Buscar uma url por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Url encontrada',
    type: Url,
  })
  @ApiResponse({
    status: 404,
    description: 'Url não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é um UUID)',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: IRequestWithTrace,
  ): Promise<Url> {
    const traceId = req.traceId;
    return this.urlService.findOne(id, traceId);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Atualizar uma url de destino por ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Url atualizada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req: IRequestWithTrace,
  ): Promise<void> {
    const traceId = req.traceId;
    return this.urlService.update(id, updateUrlDto, traceId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletar uma url por ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Url deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Url não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é um UUID)',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() removeDto: RemoveUrlDto,
    @Request() req: IRequestWithTrace,
  ): Promise<void> {
    const traceId = req.traceId;
    return this.urlService.remove(id, removeDto, traceId);
  }
}
