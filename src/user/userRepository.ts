import { User } from './user';
import { Knex } from 'knex';
import { DbConnection } from '../core/db/dbConnection';
import dbTimeLog from '../core/db/dbTimeLog';

export const USER_TABLE_NAME = 'user';

export interface UserRepository {
  findByLogin: (login: string) => Promise<User | null>;
  findByUuid: (uuid: string) => Promise<User | null>;
  save: (input: User) => Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  private db: Knex;

  constructor(
    { db }: DbConnection
  ) {
    this.db = db;
  }

  async findByLogin(login: string): Promise<User | null> {
    const result = await this.db(USER_TABLE_NAME).where('login', login).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const result = await this.db(USER_TABLE_NAME).where('uuid', uuid).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async save(input: User): Promise<User> {
    const { uuid, login, passwordHash: password, status } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), uuid, login, status, password })
      .onConflict('uuid')
      .merge({ ...dbTimeLog.updateTimeLog(), login, status, password });
    return input;
  }

  private static toUser(input: any): User {
    return new User({
      uuid: input.uuid,
      login: input.login,
      passwordHash: input.password,
      status: input.status
    });
  }
}
