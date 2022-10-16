import { testConfig } from '../config/testConfig';
import { DbConnection } from '../../../src/core/db/dbConnection';
import { Server } from 'net';
import { Request } from './request';
import { AppParams, startApp } from '../../../src/app';

export function initHttpEnv() {
  const appParams: AppParams = {
    config: testConfig,
    dbConnection: {} as DbConnection
  };
  let appServer: Server;

  return {
    startServer: () => {
      appServer = startApp(appParams);
      return new Request(appServer);
    },
    stopServer: async () => appServer.close()
  };
}
