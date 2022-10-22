import { User } from './user';
import { Knex } from 'knex';
import { DbConnection } from '../core/db/dbConnection';
import dbTimeLog from '../core/db/dbTimeLog';

export const USER_TABLE_NAME = 'user';

export interface UserRepository {
  findByUuid: (uuid: string) => Promise<User>;
  save: (input: User) => Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  private db: Knex;

  constructor(
    { db }: DbConnection
  ) {
    this.db = db;
  }

  async findByUuid(uuid: string): Promise<User> {
    const result = await this.db(USER_TABLE_NAME).where('uuid', uuid).first();
    return result ? new User({
      uuid: result.uuid,
      login: result.login,
      passwordHash: result.password,
      status: result.status
    }) : null;
  }

  async save(input: User): Promise<User> {
    const { uuid, login, passwordHash: password, status } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), uuid, login, status, password })
      .onConflict('uuid')
      .merge({ ...dbTimeLog.updateTimeLog(), login, status, password });
    return input;
  }
}
