import { Context } from 'koa';
import httpResponse from './httpResponse';
import logger from '../logger/logger';

export enum HttpDefaultError {
  Unknown = 'Unknown',
  InvalidParams = 'InvalidParams',
  InvalidBody = 'InvalidBody'
}

export async function errorMiddleware(ctx: Context, next: Function) {
  try {
    await next();
  } catch (e: any) {
    if (ctx.invalid) {
      handleValidationErrors(ctx);
    } else {
      logger.error(e);
      const status = e?.status ? e.status : 500;
      httpResponse(ctx).createErrorResponse(status, HttpDefaultError.Unknown);
    }
  }
}

function handleValidationErrors(ctx: Context) {
  if (ctx.invalid.params) {
    httpResponse(ctx).createErrorResponse(400, HttpDefaultError.InvalidParams);
  } else if (ctx.invalid.body) {
    httpResponse(ctx).createErrorResponse(400, HttpDefaultError.InvalidBody);
  } else {
    httpResponse(ctx).createErrorResponse(400, HttpDefaultError.Unknown);
  }
}
