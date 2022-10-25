import createRouter, { Spec, Router } from 'koa-joi-router';
import Joi from 'joi';

export function createExpenditureCategoryRouter(): Router {
  const router = createRouter();

  router.route(<Spec>{
    handler: ctx => {},
    path: '/budget/expenditure/category',
    method: 'post',
    validate: {
      body: {
        name: Joi.string().required()
      },
      type: 'json'
    }
  });

  return router;
}
