import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

interface RequestWithTrace extends Request {
  traceId: string;
}

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TraceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<RequestWithTrace>();
    const traceId = `req-${Date.now()}-${uuidv4().substring(0, 8)}`;

    req.traceId = traceId;

    const start = Date.now();
    this.logger.log(`[${traceId}] Iniciando ${req.method} ${req.url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(
          `[${traceId}] Concluído ${req.method} ${req.url} em ${duration}ms`,
        );
      }),
    );
  }
}
