import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { id, method, url } = request; // 미들웨어에서 설정한 요청 ID 사용

    console.log(`[${id}] [${method}] ${url} 요청 시작`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[${id}] [${method}] ${url} 요청 완료`);
      }),
    );
  }
}
