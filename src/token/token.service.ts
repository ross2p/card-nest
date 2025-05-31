import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Payload } from './dtos/payload.interface';
import { TokenType } from './tokenType.enum';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRE: number;
  private readonly REFRESH_TOKEN_EXPIRE: number;
  private readonly JWT_SECRET_KEY: string;

  constructor(configService: ConfigService) {
    this.ACCESS_TOKEN_EXPIRE = configService.get<number>(
      'ACCESS_TOKEN_EXPIRE',
    )!;
    this.REFRESH_TOKEN_EXPIRE = configService.get<number>(
      'REFRESH_TOKEN_EXPIRE',
    )!;
    this.JWT_SECRET_KEY = configService.get<string>('JWT_SECRET_KEY')!;
  }

  private generateToken<T extends Payload>(
    data: T,
    expiresIn: number,
    secretKey: string,
  ): string {
    return jwt.sign(data, secretKey, { expiresIn });
  }

  public generateTokenByType<T extends Payload>(data: T): string {
    switch (data.type) {
      case TokenType.ACCESS:
        return this.generateToken<T>(
          data,
          this.ACCESS_TOKEN_EXPIRE,
          this.JWT_SECRET_KEY,
        );
      case TokenType.REFRESH:
        return this.generateToken<T>(
          data,
          this.REFRESH_TOKEN_EXPIRE,
          this.JWT_SECRET_KEY,
        );
      default:
        throw new BadRequestException('Invalid token type');
    }
  }

  private verifyToken<T>(token: string, secretKey: string): T {
    try {
      return jwt.verify(token, secretKey) as T;
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  public verifyTokenByType<T extends Payload>(
    token: string,
    type: TokenType,
  ): T {
    if (!token) {
      throw new UnauthorizedException(
        'Access denied. No access token provided.',
      );
    }
    let data: T;

    switch (type) {
      case TokenType.ACCESS:
      case TokenType.REFRESH:
        data = this.verifyToken<T>(token, this.JWT_SECRET_KEY);
        break;
      default:
        throw new BadRequestException('Invalid token type');
    }

    if (data.type !== type) {
      throw new BadRequestException('Invalid token type');
    }
    return data;
  }
}
