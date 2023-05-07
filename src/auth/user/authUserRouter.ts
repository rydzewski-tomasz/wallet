import createRouter, { Router, Spec } from 'koa-joi-router';
import Joi from 'joi';
import { AuthUserService, LoginErrorType, SignupErrorType } from './authUserService';
import httpResponse from '../../core/http/httpResponse';
import { Context } from 'koa';

export function createUserRouter(userService: AuthUserService): Router {
  const router = createRouter();

  router.route(<Spec>{
    method: 'post',
    path: '/user/signup',
    handler: async (ctx: Context) => {
      const { username, password } = ctx.request.body;
      const result = await userService.signup({ username, password });

      if (result.isSuccess) {
        httpResponse(ctx).createSuccessResponse(200, { uuid: result.value.getUuid().value });
      } else {
        if (result.error === SignupErrorType.UsernameAlreadyExists) {
          httpResponse(ctx).createErrorResponse(400, SignupErrorType.UsernameAlreadyExists);
        }
      }
    },
    validate: {
      body: {
        username: Joi.string().required(),
        password: Joi.string().required()
      },
      type: 'json'
    }
  });

  router.route(<Spec>{
    method: 'post',
    path: '/user/login',
    handler: async (ctx: Context) => {
      const { username, password } = ctx.request.body;
      const result = await userService.login({ username, password });

      if (result.isSuccess) {
        const { accessToken } = result.value.toSnapshot();
        httpResponse(ctx).createSuccessResponse(200, {
          accessToken: accessToken?.token
        });
      } else {
        if (result.error === LoginErrorType.UserNotFound) {
          httpResponse(ctx).createErrorResponse(404, LoginErrorType.UserNotFound);
        }

        if (result.error === LoginErrorType.InvalidPassword) {
          httpResponse(ctx).createErrorResponse(401, LoginErrorType.InvalidPassword);
        }
      }
    },
    validate: {
      body: {
        username: Joi.string().required(),
        password: Joi.string().required()
      },
      type: 'json'
    }
  });

  return router;
}
