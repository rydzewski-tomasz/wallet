import Koa from 'koa';
import categoryRouter from '../../budget/expenditure/category/expenditureCategoryRouter';

export function setupRoutes(app: Koa) {
  app.use(categoryRouter.middleware());
}
