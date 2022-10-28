import Koa from 'koa';
import { createServices } from '../services';
import { createUserRouter } from '../../auth/user/userRouter';
import { AppParams } from '../../app';

export function setupRoutes(app: Koa, appParams: AppParams) {
  const { userService } = createServices(appParams);

  app.use(createUserRouter(userService).middleware());
}
