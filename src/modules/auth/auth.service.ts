import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { IUserPayload } from 'src/common/interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginDto: LoginDto,
    traceId: string,
  ): Promise<{ accessToken: string }> {
    this.logger.log(
      `[${traceId}] Iniciando processo de login para o usuário: ${loginDto.email}`,
    );
    const user = await this.usersService.findOneByEmail(
      loginDto.email,
      traceId,
    );

    if (user) {
      const matchingPassword = await compare(loginDto.password, user?.password);

      if (matchingPassword) {
        const payload = { sub: user.id, email: user.email };

        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      }
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async verifyToken(token: string): Promise<IUserPayload> {
    try {
      const payload: IUserPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return { sub: payload.sub, email: payload.email };
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
