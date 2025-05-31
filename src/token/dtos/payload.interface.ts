import { TokenType } from '../tokenType.enum';
import { JwtPayload } from 'jsonwebtoken';


export interface Payload extends JwtPayload{
  type: TokenType;
}