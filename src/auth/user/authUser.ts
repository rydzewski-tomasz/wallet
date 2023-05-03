import { Entity } from '../../core/entity';
import { createErrorResult, createSuccessResult, OK, Result } from '../../core/result';
import { AccessToken, RefreshToken } from './authToken';

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
  refreshToken?: RefreshToken;
  accessToken?: AccessToken;
}

export interface AuthUserActions {
  generateHash: (input: string) => Promise<string>;
  createAccessToken: (input: Record<string, string>) => AccessToken;
  checkHash: (password: string, hash: string) => Promise<boolean>;
}

export enum AuthUserErrorType {
  InvalidPassword = 'InvalidPassword',
  InvalidStatus = 'InvalidStatus'
}

export class AuthUser extends Entity<AuthUserProps> {
  private readonly generateHash: (input: string) => Promise<string>;
  private readonly createAccessToken: (input: Record<string, string>) => AccessToken;
  private readonly checkHash: (password: string, hash: string) => Promise<boolean>;

  constructor(props: AuthUserProps, { generateHash, checkHash, createAccessToken }: AuthUserActions) {
    super(props);

    this.generateHash = generateHash;
    this.createAccessToken = createAccessToken;
    this.checkHash = checkHash;
  }

  async signup({ username, password }: { username: string; password: string }) {
    if (this.props.status !== UserStatus.New) {
      throw new Error(AuthUserErrorType.InvalidStatus);
    }

    this.props.username = username;
    this.props.passwordHash = await this.generateHash(password);
    this.props.status = UserStatus.Unverified;
    this.props.type = UserType.User;
  }

  async login({ password }: { password: string }): Promise<Result<OK, AuthUserErrorType.InvalidPassword>> {
    if (this.props.status !== UserStatus.Active) {
      throw new Error(AuthUserErrorType.InvalidStatus);
    }

    const isValidPassword = await this.checkHash(password, this.props.passwordHash);

    if (isValidPassword) {
      this.props.accessToken = await this.createAccessToken({ uuid: this.props.uuid, type: this.props.type });
      return createSuccessResult(OK);
    } else {
      return createErrorResult(AuthUserErrorType.InvalidPassword);
    }
  }

  remove() {
    this.props.status = UserStatus.Deleted;
  }

  // function to change password
  async changePassword({ password, generateHash }: { password: string; generateHash: (input: string) => Promise<string> }) {
    this.props.passwordHash = await generateHash(password);
  }
}
