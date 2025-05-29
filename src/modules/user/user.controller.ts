import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { IPaginateResult } from 'src/common/interfaces/paginate-result.interface';
import { PageDto } from 'src/utils/dto/page.dto';
import { FindAllUserResponseDto } from './dto/find-all-user-response.dto';
import { IRequestWithTrace } from 'src/common/interfaces/request-with-trace.interface';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: IRequestWithTrace,
  ): Promise<User> {
    const traceId = req.traceId;
    return await this.userService.create(createUserDto, traceId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: [FindAllUserResponseDto],
  })
  async findAll(
    @Query() pageDto: PageDto,
    @Request() req: IRequestWithTrace,
  ): Promise<IPaginateResult<User>> {
    const traceId = req.traceId;
    return await this.userService.findAll(pageDto, traceId);
  }

  @ApiOperation({
    summary: 'Buscar um usuário por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é um UUID)',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: IRequestWithTrace,
  ): Promise<User> {
    const traceId = req.traceId;
    return this.userService.findOne(id, traceId);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Atualizar um usuário por ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: IRequestWithTrace,
  ): Promise<void> {
    const traceId = req.traceId;
    return this.userService.update(id, updateUserDto, traceId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletar um usuário por ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é um UUID)',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: IRequestWithTrace,
  ): Promise<void> {
    const traceId = req.traceId;
    return this.userService.remove(id, traceId);
  }
}
