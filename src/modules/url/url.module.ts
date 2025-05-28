import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlRedirectController } from './url-redirect.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UserModule],
  controllers: [UrlController, UrlRedirectController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
