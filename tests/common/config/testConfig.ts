import { DbConfig } from '../../../src/core/config/dbConfig';

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
