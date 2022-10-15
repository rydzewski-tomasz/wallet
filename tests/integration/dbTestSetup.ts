import { DbConnection } from '../../src/core/db/dbConnection';
import knex, { Knex } from 'knex';
import { testDbConfig } from '../common/config/testConfig';
import random from '../common/util/random';


export class DbTestSetup {
  private readonly testDbName: string
  private connection: Knex;
  private dbConnection: DbConnection;

  constructor() {
    this.testDbName = `wallet_db_${random.generateRandomString()}`;
    this.connection = knex(testDbConfig);
  }

  async createConnection(): Promise<DbConnection> {
    try {
      await this.connection.raw(`CREATE DATABASE ${this.testDbName}`);
      this.dbConnection = new DbConnection({ ...testDbConfig, connection: { ...testDbConfig.connection, database: this.testDbName } });
      await this.dbConnection.db.migrate.latest();
      return this.dbConnection;
    } catch (e) {
      console.error('Test db connection problem!');
      console.error(e);
      throw e;
    }
  }

  async destroyConnection(): Promise<void> {
    await this.dbConnection.close();
    await this.connection.raw(`DROP DATABASE ${this.testDbName}`);
    await this.connection.destroy();
  }
}

