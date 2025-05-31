import { ApiProperty } from '@nestjs/swagger';
import { AccessToken } from './access-token.dto';
import { RefreshToken } from './refresh-token.dto';

export class Tokens implements AccessToken, RefreshToken {
  @ApiProperty({
    description: 'The refresh token',
    type: String,
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The access token',
    type: String,
  })
  accessToken: string;
}


type tokens = AccessToken & RefreshToken;