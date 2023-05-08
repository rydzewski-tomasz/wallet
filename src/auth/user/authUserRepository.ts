import { AuthUser, AuthUserProps } from './authUser';
import { Knex } from 'knex';
import { DbConnection } from '../../core/db/dbConnection';
import dbTimeLog from '../../core/db/dbTimeLog';
import { AuthUserFactory } from './authUserFactory';
import { Guid } from '../../core/guid';

export const USER_TABLE_NAME = 'user';

export interface AuthUserRepository {
  findByUsername: (login: string) => Promise<AuthUser | null>;
  findByUuid: (uuid: Guid) => Promise<AuthUser | null>;
  save: (input: AuthUser) => Promise<AuthUser>;
}

export function createAuthUserRepository({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }): AuthUserRepository {
  return new AuthUserRepositoryImpl({ dbConnection, userFactory });
}

export class AuthUserRepositoryImpl implements AuthUserRepository {
  private readonly authUserFactory: AuthUserFactory;
  private db: Knex;

  constructor({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }) {
    this.db = dbConnection.db;
    this.authUserFactory = userFactory;
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('username', username).first();
    return result ? this.toUser(result) : null;
  }

  async findByUuid(uuid: Guid): Promise<AuthUser | null> {
    const result = await this.db(USER_TABLE_NAME).where('id', uuid.uuid).first();
    return result ? this.toUser(result) : null;
  }

  async save(input: AuthUser): Promise<AuthUser> {
    const { id, username, passwordHash: password, status, type } = input.toSnapshot();

    await this.db(USER_TABLE_NAME)
      .insert({ ...dbTimeLog.createTimeLog(), id: id.uuid, username, status, password, type })
      .onConflict('id')
      .merge({ ...dbTimeLog.updateTimeLog(), username, status, password, type });
    return input;
  }

  private toUser(input: any): AuthUser {
    const props: AuthUserProps = {
      id: Guid.fromUuid(input.id),
      username: input.username,
      passwordHash: input.password,
      status: input.status,
      type: input.type
    };
    return this.authUserFactory.create({ props });
  }
}
