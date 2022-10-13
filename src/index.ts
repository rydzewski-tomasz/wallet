import Koa from 'koa';

const config = {
  host: 'localhost',
  port: 3000
};

function startApp() {
  const { host, port } = config;
  const app = new Koa();

  app.listen(port, host);

  console.log(`Listening on ${host}:${port}`);
}

startApp();
