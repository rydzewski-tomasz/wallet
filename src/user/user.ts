import bcrypt from 'bcryptjs';
import { Entity } from '../core/entity';

const SALT_ROUNDS = 10;

export enum UserStatus {
  New = 'New',
  Unverified = 'Unverified',
  Active = 'Active',
  Deleted = 'Deleted'
}

interface UserProps {
  uuid: string;
  login: string;
  passwordHash: string;
  status: UserStatus
}

export class User extends Entity {
  constructor(
    private props: UserProps
  ) {
    super(props);
  }

  async signup({ login, password }: { login: string, password: string }) {
    this.props.login = login;
    this.props.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  remove() {
    this.props.status = UserStatus.Deleted;
  }

  toSnapshot(): UserProps {
    return this.props;
  }
}

