import Koa from 'koa';
import { appConfig, AppConfig } from './core/config/appConfig';

function startApp(config: AppConfig) {
  const { host, port } = config;
  const app = new Koa();

  app.listen(port, host);

  console.log(`Listening on ${host}:${port}`);
}

startApp(appConfig);
