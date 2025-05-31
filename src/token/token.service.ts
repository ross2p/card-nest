import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TokenType } from '../../enums';
import { UserPayload } from '../../interfaces';
import { Tokens } from './dtos/tokens.dto';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRE: number;
  private readonly REFRESH_TOKEN_EXPIRE: number;
  private readonly JWT_SECRET_KEY: string;

  constructor(configService: ConfigService) {
    this.ACCESS_TOKEN_EXPIRE = configService.get<number>('ACCESS_TOKEN_EXPIRE')!;
    this.REFRESH_TOKEN_EXPIRE = configService.get<number>('REFRESH_TOKEN_EXPIRE')!;
    this.JWT_SECRET_KEY = configService.get<string>('JWT_SECRET_KEY')!;
  }

  private async generateToken(data: any, expiresIn: number, secretKey: string): Promise<string> {
    return jwt.sign(data, secretKey, { expiresIn });
  }

  public async generateTokenByType(data: any, type: TokenType): Promise<string> {
    data.type = type;

    switch (type) {
      case TokenType.ACCESS:
        return this.generateToken(data, this.ACCESS_TOKEN_EXPIRE, this.JWT_SECRET_KEY);
      case TokenType.REFRESH:
        return this.generateToken(data, this.REFRESH_TOKEN_EXPIRE, this.JWT_SECRET_KEY);
      default:
        throw new BadRequestException('Invalid token type');
    }
  }

  private async verifyToken(token: string, secretKey: string) {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  public async verifyTokenByType(token: string, type: TokenType) {
    if (!token) {
      throw new UnauthorizedException('Access denied. No access token provided.');
    }
    let data: UserPayload;

    switch (type) {
      case TokenType.ACCESS:
      case TokenType.REFRESH:
        data = (await this.verifyToken(token, this.JWT_SECRET_KEY)) as UserPayload;
        break;
      default:
        throw new BadRequestException('Invalid token type');
    }
    if (data.type !== type) {
      throw new BadRequestException('Invalid token');
    }
    return data;
  }

  public async generateAccessTokens(user: UserPayload): Promise<Tokens> {
    const tokenUser = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
    } as UserPayload;

    const [accessToken, refreshToken] = await Promise.all([this.generateTokenByType(tokenUser, TokenType.ACCESS), this.generateTokenByType(tokenUser, TokenType.REFRESH)]);
    return { accessToken, refreshToken };
  }
}
