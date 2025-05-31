import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../constants.utils';
import { SuccessResponse } from '../response/success.response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const handler = context.getHandler();

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, handler);
    const status: number = response.statusCode;
    return next.handle().pipe(
      map((data: unknown) => (new SuccessResponse(data, message, status))),
    );
  }
}
