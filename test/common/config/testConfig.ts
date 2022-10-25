import { DbConfig } from '../../../src/core/config/dbConfig';
import { AppConfig } from '../../../src/core/config/appConfig';

export const testDbConfig: DbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 9002,
    database: 'wallet_db',
    user: 'wallet_user',
    password: 'wallet_password'
  },
  migrations: {
    directory: './src/core/db/migrations'
  }
};

export const testConfig: AppConfig = {
  port: 0,
  db: testDbConfig
};
