import { AppConfig } from './core/config/appConfig';
import { DbConnection } from './core/db/dbConnection';
import { Server } from 'net';
import Koa from 'koa';
import { setupRoutes } from './core/http/setupRoutes';
import { errorMiddleware } from './core/http/errorMiddleware';

export interface AppParams {
  config: AppConfig;
  dbConnection: DbConnection;
}

export function startApp({ config, dbConnection }: AppParams): Server {
  const { port } = config;
  const app = new Koa();
  app.context.dbConnection = dbConnection;

  app.use(errorMiddleware);
  setupRoutes(app);

  const server = app.listen(port,)

  console.log(`Listening on port:${port}`);

  return server;
}
