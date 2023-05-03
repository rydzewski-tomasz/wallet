import { AuthUser, AuthUserProps } from './authUser';
import { Knex } from 'knex';
import { DbConnection } from '../../core/db/dbConnection';
import dbTimeLog from '../../core/db/dbTimeLog';
import { AuthUserFactory } from './authUserFactory';

export const USER_TABLE_NAME = 'user';

export interface AuthUserRepository {
  findByUsername: (login: string) => Promise<AuthUser | null>;
  findByUuid: (uuid: string) => Promise<AuthUser | null>;
  save: (input: AuthUser) => Promise<AuthUser>;
}

export function createUserRepository({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }): AuthUserRepository {
  return new UserRepositoryImpl({ dbConnection, userFactory });
}

export class UserRepositoryImpl implements AuthUserRepository {
  private readonly userFactory: AuthUserFactory;
  private db: Knex;

  constructor({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }) {
    this.db = dbConnection.db;
    this.userFactory = userFactory;
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('username', username).first();
    return result ? this.toUser(result) : null;
  }

  async findByUuid(uuid: string): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('uuid', uuid).first();
    return result ? this.toUser(result) : null;
  }

  async save(input: AuthUser): Promise<AuthUser> {
    const { uuid, username, passwordHash: password, status, type } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), uuid, username, status, password, type })
      .onConflict('uuid')
      .merge({ ...dbTimeLog.updateTimeLog(), username, status, password, type });
    return input;
  }

  private toUser(input: any): AuthUser {
    const props: AuthUserProps = {
      uuid: input.uuid,
      username: input.username,
      passwordHash: input.password,
      status: input.status,
      type: input.type
    };
    return this.userFactory.create({ props });
  }
}
