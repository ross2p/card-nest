import { ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../response/error.response';

export abstract class IExceptionHandler<T = unknown> implements ExceptionFilter<T> {
  private readonly logger: Logger = new Logger(this.constructor.name);
  abstract handle(exception: unknown): ErrorResponse;

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(`Exception: ${exception}`, exception as Error);
    const result =  this.handle(exception);
    response.status(result.statusCode).json(result);
  }
}