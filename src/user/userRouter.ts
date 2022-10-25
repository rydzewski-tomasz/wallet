import createRouter, { Router, Spec } from 'koa-joi-router';
import Joi from 'joi';
import { SignupErrorType, UserService } from './userService';
import httpResponse from '../core/http/httpResponse';
import { Context } from 'koa';

export function createUserRouter(
  userService: UserService
): Router {
  const router = createRouter();

  router.route(<Spec> {
    method: 'post',
    path: '/user/signup',
    handler: async (ctx: Context) => {
      const { login, password } = ctx.request.body;
      const result = await userService.signup({ login, password });

      if (result.isSuccess) {
        httpResponse(ctx).createSuccessResponse(200, { uuid: result.value.getUuid() });
      } else if (result.isSuccess == false) {
        if (result.error === SignupErrorType.LoginAlreadyExists) {
          httpResponse(ctx).createErrorResponse(400, SignupErrorType.LoginAlreadyExists);
        }
      }
    },
    validate: {
      body: {
        login: Joi.string().required(),
        password: Joi.string().required()
      },
      type: 'json'
    }
  });

  return router;
}
