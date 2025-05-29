import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceInterceptor } from './interceptors/trace.interceptor';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { UrlModule } from './modules/url/url.module';
import { Url } from './modules/url/entities/url.entity';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Url],
      synchronize: true,
      ssl: Boolean(process.env.DB_SSL) || false,
    }),
    UserModule,
    UrlModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceInterceptor,
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
