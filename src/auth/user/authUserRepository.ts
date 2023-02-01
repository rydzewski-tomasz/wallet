import { AuthUser } from './authUser';
import { Knex } from 'knex';
import { DbConnection } from '../../core/db/dbConnection';
import dbTimeLog from '../../core/db/dbTimeLog';

export const USER_TABLE_NAME = 'user';

export interface AuthUserRepository {
  findByUsername: (login: string) => Promise<AuthUser | null>;
  findByUuid: (uuid: string) => Promise<AuthUser | null>;
  save: (input: AuthUser) => Promise<AuthUser>;
}

export function createUserRepository({ dbConnection }: { dbConnection: DbConnection }): AuthUserRepository {
  return new UserRepositoryImpl(dbConnection);
}

export class UserRepositoryImpl implements AuthUserRepository {
  private db: Knex;

  constructor({ db }: DbConnection) {
    this.db = db;
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('username', username).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async findByUuid(uuid: string): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('uuid', uuid).first();
    return result ? UserRepositoryImpl.toUser(result) : null;
  }

  async save(input: AuthUser): Promise<AuthUser> {
    const { uuid, username, passwordHash: password, status, type } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), uuid, username, status, password, type })
      .onConflict('uuid')
      .merge({ ...dbTimeLog.updateTimeLog(), username, status, password, type });
    return input;
  }

  private static toUser(input: any): AuthUser {
    return new AuthUser({
      uuid: input.uuid,
      username: input.username,
      passwordHash: input.password,
      status: input.status,
      type: input.type
    });
  }
}
