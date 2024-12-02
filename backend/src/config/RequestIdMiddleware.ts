import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { asyncLocalStorage } from './CustomLogger';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.id = uuidv4(); // 요청 ID 생성
    console.log(`[Middleware] 요청 ID 생성: ${req.id}`);
    asyncLocalStorage.run({ id: req.id }, () => {
      next();
    });
  }
}
