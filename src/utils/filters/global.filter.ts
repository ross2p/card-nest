import { Catch, HttpStatus } from '@nestjs/common';
import { IExceptionHandler } from './iException.filter';
import { ErrorResponse } from '../response/error.response';

@Catch()
export class GlobalFilter extends IExceptionHandler {
  handle(): ErrorResponse {
    return new ErrorResponse('Unexpected error', HttpStatus.BAD_REQUEST);
  }
}
