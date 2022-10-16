import Router, { Spec } from 'koa-joi-router';
import Joi from 'joi';

const router = Router();

router.route(<Spec> {
  handler: ctx => {

  },
  path: '/budget/expenditure/category',
  method: 'post',
  validate: {
    body: {
      name: Joi.string().required()
    },
    type: 'json'
  }
});

export default router;
