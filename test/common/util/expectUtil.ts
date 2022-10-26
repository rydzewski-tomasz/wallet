import { ErrorHttpStatus, SuccessHttpStatus } from '../../../src/core/http/httpResponse';
import { Response } from 'superagent';
import { Entity, WithUuid } from '../../../src/core/entity';
import { Result } from '../../../src/core/result';
import { expect } from 'expect';

export function expectResponse(res: Response): {
  toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => void;
  toBeError: (expStatus: ErrorHttpStatus, type: string) => void;
} {
  return {
    toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => {
      expect({
        status: res.status,
        body: res.body
      }).toStrictEqual({
        status: expStatus,
        body: data || {}
      });
    },
    toBeError: (expStatus: ErrorHttpStatus, type: string) => {
      expect({
        status: res.status,
        body: res.body
      }).toStrictEqual({
        status: expStatus,
        body: { type }
      });
    }
  };
}

export function expectResultEntity<Value extends Entity<WithUuid>, Error>(
  result: Result<Value, Error>
): {
  toBeSuccess: (value: Value) => void;
  toBeError: (error: Error) => void;
} {
  return {
    toBeSuccess: value => {
      expect({
        isSuccess: result.isSuccess,
        uuid: result.isSuccess ? result.value.getUuid() : undefined
      }).toStrictEqual({
        isSuccess: true,
        uuid: value.getUuid()
      });
    },
    toBeError: error => {
      expect({
        isSuccess: result.isSuccess,
        error: result.isSuccess ? undefined : result.error
      }).toStrictEqual({
        isSuccess: false,
        error: error
      });
    }
  };
}

export function expectEntity<Props extends WithUuid>(
  actual: Entity<Props> | undefined | null
): {
  toBe: (expected: Entity<Props>) => void;
  toStrictEqual: (expected: Entity<Props>) => void;
} {
  return {
    toBe: expected => {
      expect({ uuid: actual?.getUuid() }).toStrictEqual({ uuid: expected.getUuid() });
    },
    toStrictEqual: expected => {
      expect(actual?.toSnapshot()).toStrictEqual(expected.toSnapshot());
    }
  };
}
