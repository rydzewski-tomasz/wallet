import bcrypt from 'bcryptjs';
import { Entity } from '../core/entity';

const SALT_ROUNDS = 10;

export enum UserStatus {
  New = 'New',
  Unverified = 'Unverified',
  Active = 'Active',
  Deleted = 'Deleted'
}

export interface UserProps {
  uuid: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  async signup({ username, password }: { username: string; password: string }) {
    if (this.props.status !== UserStatus.New) {
      throw new Error('InvalidStatus');
    }

    this.props.username = username;
    this.props.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  remove() {
    this.props.status = UserStatus.Deleted;
  }
}
