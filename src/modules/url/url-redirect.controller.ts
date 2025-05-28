import { Controller, Get, HttpCode, Param, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithTrace } from 'src/common/interfaces/request-with-trace.interface';
import { UrlService } from './url.service';
import { Response } from 'express';

@ApiTags('Redirect')
@Controller()
export class UrlRedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortUrl')
  @HttpCode(302)
  @ApiOperation({
    summary: 'Redirecionar para a url original a partir da url encurtada',
    description:
      'Esse endpoint realiza um redirecionamento 302. Teste diretamente no navegador.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento para a url original',
  })
  @ApiResponse({
    status: 404,
    description: 'Url encurtada não encontrada',
  })
  async redirect(
    @Param('shortUrl') shortUrl: string,
    @Request() req: IRequestWithTrace,
    @Res() res: Response,
  ): Promise<void> {
    const traceId = req.traceId;
    const originalUrl = await this.urlService.redirect(shortUrl, traceId);
    res.redirect(originalUrl);
  }
}
