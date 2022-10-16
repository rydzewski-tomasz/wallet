import { appConfig } from './core/config/appConfig';
import { DbConnection } from './core/db/dbConnection';
import { AppParams, startApp } from './app';

function createAppParams(): AppParams {
  return {
    config: appConfig,
    dbConnection: new DbConnection(appConfig.db)
  };
}

const appParams = createAppParams();
startApp(appParams);
