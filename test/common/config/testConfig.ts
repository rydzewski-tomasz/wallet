import { DbConfig } from '../../../src/core/config/dbConfig';
import { AppConfig } from '../../../src/core/config/appConfig';

const { TEST_ENV } = process.env;
const DOCKER_ENV_NAME = 'docker';

const localTestDbConfig: DbConfig = {
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

const localTestConfig: AppConfig = {
  port: 0,
  accessToken: {
    secret: 'test',
    expiresInSec: 15 * 60
  },
  db: localTestDbConfig
};

const dockerTestDbConfig: DbConfig = {
  client: 'pg',
  connection: {
    host: 'wallet_test_db',
    port: 5432,
    database: 'wallet_db',
    user: 'wallet_user',
    password: 'wallet_password'
  },
  migrations: {
    directory: './src/core/db/migrations'
  }
};

const dockerTestConfig: AppConfig = {
  port: 0,
  accessToken: {
    secret: 'test',
    expiresInSec: 15 * 60
  },
  db: dockerTestDbConfig
};

function getDbConfig(): DbConfig {
  return isDockerEnv() ? dockerTestDbConfig : localTestDbConfig;
}

function getAppConfig(): AppConfig {
  return isDockerEnv() ? dockerTestConfig : localTestConfig;
}

function isDockerEnv(): boolean {
  return TEST_ENV === DOCKER_ENV_NAME;
}

export default {
  getDbConfig,
  getAppConfig
};
