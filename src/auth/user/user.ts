import bcrypt from 'bcryptjs';
import { Entity } from '../../core/entity';
import { createErrorResult, createSuccessResult, OK, Result } from '../../core/result';

const SALT_ROUNDS = 10;

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

export interface UserProps {
  uuid: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
  type: UserType;
  refreshToken?: string;
  accessToken?: string;
}

export enum UserErrorType {
  InvalidPassword = 'InvalidPassword',
  InvalidStatus = 'InvalidStatus'
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  async signup({ username, password }: { username: string; password: string }) {
    if (this.props.status !== UserStatus.New) {
      throw new Error(UserErrorType.InvalidStatus);
    }

    this.props.username = username;
    this.props.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    this.props.status = UserStatus.Unverified;
    this.props.type = UserType.User;
  }

  async login({ password }: { password: string }): Promise<Result<OK, UserErrorType.InvalidPassword>> {
    if (this.props.status !== UserStatus.Active) {
      throw new Error(UserErrorType.InvalidStatus);
    }

    const isValidPassword = await bcrypt.compare(password, this.props.passwordHash);
    return isValidPassword ? createSuccessResult(OK) : createErrorResult(UserErrorType.InvalidPassword);
  }

  remove() {
    this.props.status = UserStatus.Deleted;
  }
}
