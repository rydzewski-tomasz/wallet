import { Entity } from '../../core/entity';
import { ValueObject } from '../../core/valueObject';
import { Guid } from '../../core/guid';

export interface AccessTokenProps {
  token: string;
  payload: Record<string, string>;
}

export class AccessToken extends ValueObject<AccessTokenProps> {
  get token() {
    return this.props.token;
  }

  get payload() {
    return this.props.payload;
  }

  constructor(props: AccessTokenProps) {
    super(props);
  }

  equals(valueObject?: ValueObject<AccessTokenProps>): boolean {
    return this.props.token === valueObject?.props.token;
  }
}

export interface RefreshTokenProps {
  id: Guid;
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
