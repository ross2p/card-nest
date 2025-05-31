import { HttpStatus } from '@nestjs/common';

export class GlobalResponse<T = any> {
  status: number;
  message: string;
  name: string;
  data: T;

  constructor(status: number, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.name = HttpStatus[status] || 'UNKNOWN_STATUS';
  }
}



export class SuccessResponse<T = any> extends GlobalResponse<T> {
  constructor(data: T, message: string = 'Success', status: number = 200) {
    super(status, message, data);
  }
}

export class ErrorResponse<T = any > extends GlobalResponse<T | null> {
  constructor(
    message: string,
    status: number = 500,
    data: T | null = null,
  ) {
    super(status, message, data);
  }
}