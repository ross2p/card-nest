import { Catch } from '@nestjs/common';
import { IExceptionHandler } from './iException.filter';
import { ErrorResponse } from '../response/error.response';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Catch(HttpException)
export class ExceptionFilter extends IExceptionHandler {
  handle(exception: HttpException): ErrorResponse {
    const response = exception.getResponse() as {
      message?: string;
      error?: string;
      statusCode?: number;
      [key: string]: any;
    };
    const { message, ...data } = response;
    delete data.statusCode;
    delete data.error;

    return new ErrorResponse(
      message || 'Unexpected error',
      exception.getStatus(),
      data || null,
    );
  }
}
