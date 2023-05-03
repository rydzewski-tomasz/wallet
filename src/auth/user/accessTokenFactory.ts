import { AccessToken } from './authToken';
import jwt from 'jsonwebtoken';

export interface AccessTokenFactory {
  create: (payload: Record<string, string>) => AccessToken;
}

export class AccessTokenFactoryImpl implements AccessTokenFactory {
  create(payload: Record<string, string>): AccessToken {
    return new AccessToken({
      token: jwt.sign(payload, 'test', { expiresIn: '15m' }),
      payload
    });
  }
}
