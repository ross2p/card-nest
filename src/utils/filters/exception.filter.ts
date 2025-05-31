import { Catch, HttpStatus, NotFoundException } from '@nestjs/common';
import { IExceptionHandler } from './iException.filter';
import { ErrorResponse } from '../response/error.response';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Catch(HttpException)
export class ExceptionFilter extends IExceptionHandler {
  handle(exception: HttpException): ErrorResponse {
    const {message, error, statusCode, ...data} = exception.getResponse() as any;
    return new ErrorResponse(
      message || 'Unexpected error',
      exception.getStatus(),
      data || null,
    );
  }
}