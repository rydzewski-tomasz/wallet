import { AccessToken } from './authToken';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../../core/config/appConfig';

export interface AccessTokenFactory {
  create: (payload: Record<string, string>) => AccessToken;
}

export class AccessTokenFactoryImpl implements AccessTokenFactory {
  private readonly config: AppConfig;

  constructor({ config }: { config: AppConfig }) {
    this.config = config;
  }

  create(payload: Record<string, string>): AccessToken {
    const { secret, expiresInSec } = this.config.accessToken;

    return new AccessToken({
      token: jwt.sign(payload, secret, { expiresIn: `${expiresInSec}s` }),
      payload
    });
  }
}
