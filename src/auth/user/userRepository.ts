import { User } from './user';
import { Knex } from 'knex';
import { DbConnection } from '../../core/db/dbConnection';
import dbTimeLog from '../../core/db/dbTimeLog';

export const USER_TABLE_NAME = 'user';

export interface UserRepository {
  findByUsername: (login: string) => Promise<User | null>;
  findByUuid: (uuid: string) => Promise<User | null>;
  save: (input: User) => Promise<User>;
}

export function createUserRepository({ dbConnection }: { dbConnection: DbConnection }): UserRepository {
  return new UserRepositoryImpl(dbConnection);
}

export class UserRepositoryImpl implements UserRepository {
  private db: Knex;

  constructor({ db }: DbConnection) {
    this.db = db;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.db(USER_TABLE_NAME).where('username', username).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const result = await this.db(USER_TABLE_NAME).where('uuid', uuid).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async save(input: User): Promise<User> {
    const { uuid, username, passwordHash: password, status } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), uuid, username, status, password })
      .onConflict('uuid')
      .merge({ ...dbTimeLog.updateTimeLog(), username, status, password });
    return input;
  }

  private static toUser(input: any): User {
    return new User({
      uuid: input.uuid,
      username: input.username,
      passwordHash: input.password,
      status: input.status
    });
  }
}
