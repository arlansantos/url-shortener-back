import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginDto: LoginDto,
    traceId: string,
  ): Promise<{ accessToken: string }> {
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
}
