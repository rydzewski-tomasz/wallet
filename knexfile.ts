import { appConfig } from './src/core/config/appConfig';
import { Knex } from 'knex';

module.exports = (): Knex.Config => {
  const { db } = appConfig;
  return db;
}
