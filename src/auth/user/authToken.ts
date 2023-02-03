import { Entity } from '../../core/entity';
import { ValueObject } from '../../core/valueObject';

export interface AccessTokenProps {
  token: string;
}

export class AccessToken extends ValueObject<AccessTokenProps> {
  get token() {
    return this.props.token;
  }

  constructor(props: AccessTokenProps) {
    super(props);
  }

  equals(valueObject?: ValueObject<AccessTokenProps>): boolean {
    return this.props.token === valueObject?.props.token;
  }
}

export interface RefreshTokenProps {
  uuid: string;
  token: string;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  constructor(props: RefreshTokenProps) {
    super(props);
  }
}

export interface AuthTokens {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}
