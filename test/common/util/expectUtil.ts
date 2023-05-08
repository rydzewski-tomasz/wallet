import { ErrorHttpStatus, SuccessHttpStatus } from '../../../src/core/http/httpResponse';
import { Response } from 'superagent';
import { Entity, WithId } from '../../../src/core/entity';
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

export function expectResult<Value, Error>(
  result: Result<Value, Error>
): {
  toBeSuccess: (value: Value) => void;
  toBeError: (error: Error) => void;
} {
  return {
    toBeSuccess: value => {
      expect({
        isSuccess: result.isSuccess,
        value: result.isSuccess ? result.value : undefined
      }).toStrictEqual({
        isSuccess: true,
        value: value
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

export function expectResultEntity<Value extends Entity<WithId>, Error>(
  result: Result<Value, Error>
): {
  toBeSuccess: (value: Value) => void;
  toBeError: (error: Error) => void;
} {
  return {
    toBeSuccess: value => {
      expect({
        isSuccess: result.isSuccess,
        id: result.isSuccess ? result.value.getId() : undefined
      }).toStrictEqual({
        isSuccess: true,
        id: value.getId()
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

export function expectEntity<Props extends WithId>(
  actual: Entity<Props> | undefined | null
): {
  toHaveEqualReference: (expected: Entity<Props>) => void;
  toHaveEqualValue: (expected: Entity<Props>) => void;
} {
  return {
    toHaveEqualReference: expected => {
      expect({ id: actual?.getId() }).toStrictEqual({ id: expected.getId() });
    },
    toHaveEqualValue: expected => {
      expect(actual?.toSnapshot()).toStrictEqual(expected.toSnapshot());
    }
  };
}
