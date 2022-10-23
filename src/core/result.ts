export type Result<Value, Error> = { isSuccess: true, value: Value } | { isSuccess: false, error: Error };

export function createSuccessResult<Value, Error = 'string'>(value: Value): Result<Value, Error> {
  return { isSuccess: true, value };
}

export function createErrorResult<Value, Error = 'string'>(error: Error): Result<Value, Error> {
  return { isSuccess: false, error };
}
