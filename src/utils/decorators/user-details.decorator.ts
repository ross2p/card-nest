import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from 'src/token/dtos/payload.interface';

interface UserPayload extends Payload {
  id: string;
}

export const UserDetails = createParamDecorator(
  (_, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      throw new UnauthorizedException('User is not logged in.');
    }
    return request.user as UserPayload;
  },
);
