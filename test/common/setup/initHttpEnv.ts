import { Request } from './request';
import Koa from 'koa';
import { Router } from 'koa-joi-router';
import { errorMiddleware } from '../../../src/core/http/errorMiddleware';
import { Server } from 'net';

export function initHttpEnv() {
  const app = new Koa();
  let server: Server;

  return {
    startServer: (createRouter: () => Router) => {
      const router = createRouter();
      app.use(errorMiddleware);
      app.use(router.middleware());
      server = app.listen(0);
      return new Request(server);
    },
    stopServer: () => server.close()
  };
}
