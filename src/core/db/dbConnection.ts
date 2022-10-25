import knex, { Knex } from 'knex';
import { DbConfig } from '../config/dbConfig';

export class DbConnection {
  private readonly _db: Knex;

  constructor(private dbConfig: DbConfig) {
    this._db = knex(this.dbConfig);
  }

  get db(): Knex {
    return this._db;
  }

  async close(): Promise<void> {
    await this._db.destroy();
  }
}
