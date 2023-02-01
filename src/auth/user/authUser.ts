import bcrypt from 'bcryptjs';
import { Entity } from '../../core/entity';
import { createErrorResult, createSuccessResult, OK, Result } from '../../core/result';
import { UserAccessToken, UserRefreshToken } from './authToken';

export enum UserStatus {
  New = 'New',
  Unverified = 'Unverified',
  Active = 'Active',
  Deleted = 'Deleted'
}

export enum UserType {
  Admin = 'Admin',
  User = 'User'
}

export interface AuthUserProps {
  uuid: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
  type: UserType;
  refreshToken?: UserRefreshToken;
  accessToken?: UserAccessToken;
}

export enum AuthUserErrorType {
  InvalidPassword = 'InvalidPassword',
  InvalidStatus = 'InvalidStatus'
}

export class AuthUser extends Entity<AuthUserProps> {
  constructor(props: AuthUserProps) {
    super(props);
  }

  async signup({ username, password, generateHash }: { username: string; password: string; generateHash: (input: string) => Promise<string> }) {
    if (this.props.status !== UserStatus.New) {
      throw new Error(AuthUserErrorType.InvalidStatus);
    }

    this.props.username = username;
    this.props.passwordHash = await generateHash(password);
    this.props.status = UserStatus.Unverified;
    this.props.type = UserType.User;
  }

  async login({ password }: { password: string }): Promise<Result<OK, AuthUserErrorType.InvalidPassword>> {
    if (this.props.status !== UserStatus.Active) {
      throw new Error(AuthUserErrorType.InvalidStatus);
    }

    const isValidPassword = await bcrypt.compare(password, this.props.passwordHash);

    if (isValidPassword) {
      //this.props.accessToken = ;
      return createSuccessResult(OK);
    } else {
      return createErrorResult(AuthUserErrorType.InvalidPassword);
    }
  }

  remove() {
    this.props.status = UserStatus.Deleted;
  }
}
