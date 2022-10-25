import { startApp } from '../../../src/app';
import { Request } from './request';
import { testConfig } from '../config/testConfig';
import { Server } from 'net';
import { DbTestSetup } from './dbTestSetup';

export function initFullEnv() {
  let server: Server;
  const dbTestSetup = new DbTestSetup();

  return {
    startEnv: async () => {
      const dbConnection = await dbTestSetup.createConnection();
      server = startApp({ config: testConfig, dbConnection });
      return { request: new Request(server), dbConnection };
    },
    stopEnv: async () => {
      server.close();
      await dbTestSetup.destroyConnection();
    }
  };
}
