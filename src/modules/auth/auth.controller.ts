import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IRequestWithTrace } from 'src/common/interfaces/request-with-trace.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Realizar login',
  })
  @ApiResponse({
    status: 201,
    description: 'Login realizado com sucesso',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  async signIn(@Body() loginDto: LoginDto, @Request() req: IRequestWithTrace) {
    const traceId = req.traceId;
    return this.authService.signIn(loginDto, traceId);
  }
}
