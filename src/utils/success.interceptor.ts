import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessInterceptor extends NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const res = ctx.switchToHttp().getResponse<Response>();
        const statusCode = res.statusCode;
        return next.handle().pipe(
            map((data) => ({
                statusCode,
                error: undefined,
                data,
            })),
        );
    }
}
