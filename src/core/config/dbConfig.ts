export interface DbConfig {
  client: 'pg';
  connection: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  migrations: {
    directory: string;
  };
}
