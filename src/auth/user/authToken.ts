import { Entity } from '../../core/entity';
import { ValueObject } from '../../core/valueObject';

export interface UserAccessTokenProps {
  token: string;
}

export class AccessToken extends ValueObject<UserAccessTokenProps> {
  constructor(props: UserAccessTokenProps) {
    super(props);
  }

  equals(valueObject?: ValueObject<UserAccessTokenProps>): boolean {
    return this.props.token === valueObject?.props.token;
  }
}

export interface RefreshTokenProps {
  uuid: string;
  token: string;
}

export class UserRefreshToken extends Entity<RefreshTokenProps> {
  constructor(props: RefreshTokenProps) {
    super(props);
  }
}
