import { AppConfig } from './core/config/appConfig';
import { DbConnection } from './core/db/dbConnection';
import { Server } from 'net';
import Koa from 'koa';
import { setupRoutes } from './core/http/setupRoutes';
import { errorMiddleware } from './core/http/errorMiddleware';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface AppParams {
  config: AppConfig;
  dbConnection: DbConnection;
}

export function startApp(appParams: AppParams): Server {
  const { port } = appParams.config;
  const app = new Koa();

  app.use(errorMiddleware);

  setupRoutes(app, appParams);

  const server = app.listen(port);

  console.log(`Listening on port:${port}`);

  return server;
}
