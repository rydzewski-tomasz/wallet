import { Context } from 'koa';

export type SuccessHttpStatus = 200 | 201 | 202 | 204;
export type ErrorHttpStatus = 400 | 401 | 404 | 503;

function createSuccessResponse(ctx: Context) {
  return (status: SuccessHttpStatus | number, data?: Record<string, any>) => {
    ctx.response.status = status;
    ctx.response.body = { data };
  };
}

function createErrorResponse(ctx: Context) {
  return (status: ErrorHttpStatus | number, type: string) => {
    ctx.response.status = status;
    ctx.response.body = { type };
  };
}

function httpResponse(ctx: Context) {
  return {
    createSuccessResponse: createSuccessResponse(ctx),
    createErrorResponse: createErrorResponse(ctx)
  };
}

export default httpResponse;