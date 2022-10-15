import { DbConfig } from './dbConfig';


export interface AppConfig {
  host: string;
  port: number;
  db: DbConfig;
}

export const appConfig: AppConfig = {
  host: 'localhost',
  port: 3000,
  db: {
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
  }
};
