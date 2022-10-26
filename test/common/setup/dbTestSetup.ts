import { DbConnection } from '../../../src/core/db/dbConnection';
import knex, { Knex } from 'knex';
import random from '../util/random';
import testConfig from '../config/testConfig';

export class DbTestSetup {
  private readonly testDbName: string;
  private connection: Knex;
  private dbConnection?: DbConnection;

  constructor() {
    this.testDbName = `wallet_db_${random.generateRandomString()}`;
    this.connection = knex(testConfig.getDbConfig());
  }

  async createConnection(): Promise<DbConnection> {
    try {
      const testDbConfig = testConfig.getDbConfig();
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
    await this.dbConnection?.close();
    await this.connection.raw(`DROP DATABASE ${this.testDbName}`);
    await this.connection.destroy();
  }
}
