import { ErrorHttpStatus, SuccessHttpStatus } from '../../../src/core/http/httpResponse';
import { Response } from 'superagent'
import { Entity, WithUuid } from '../../../src/core/entity';
import { Result } from '../../../src/core/result';
import { expect } from 'expect';
import { Err } from 'joi';

export function expectResponse(res: Response): {
  toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => void
  toBeError: (expStatus: ErrorHttpStatus, type: string) => void
} {
  return {
    toBeSuccess: (expStatus: SuccessHttpStatus, data?: any) => {
      if (res.status != expStatus) {
        console.log(`Expected success status ${expStatus} but got ${res.status} with body: ${JSON.stringify(res.body)}`);
      }

      expect(res.status).toEqual(expStatus);
      if (data === undefined) {
        expect(res.body).toStrictEqual({ });
      } else {
        expect(res.body).toStrictEqual({ data });
      }
    },
    toBeError: (expStatus: ErrorHttpStatus, type: string) => {
      if (res.status != expStatus) {
        console.log(`Expected error status ${expStatus} but got ${res.status} with body: ${JSON.stringify(res.body)}`);
      }

      expect(res.status).toEqual(expStatus);
      expect(res.body).toStrictEqual({ type });
    }
  }
}

export function expectResultEntity<Value extends Entity<WithUuid>, Error>(result: Result<Value, Error>): {
  toBeSuccess: (value: Value) => void,
  toBeError: (error: Error) => void
} {
  return {
    toBeSuccess: (value) => {
      expect({
        isSuccess: result.isSuccess,
        uuid: result.isSuccess ? result.value.getUuid() : undefined
      }).toStrictEqual({
        isSuccess: true,
        uuid: value.getUuid()
      });
    },
    toBeError: (error) => {
      expect({
        isSuccess: result.isSuccess,
        error: result.isSuccess === false ?  result.error : undefined
      }).toStrictEqual({
        isSuccess: false,
        error: error
      })
    }
  };
}

export function expectEntity<Props extends WithUuid>(actual: Entity<Props>): {
  toBe: (expected: Entity<Props>) => void,
  toStrictEqual: (expected: Entity<Props>) => void
} {
  return {
    toBe: (expected) => {
      expect({ uuid: actual.getUuid() }).toStrictEqual({ uuid: expected.getUuid() });
    },
    toStrictEqual: (expected) => {
      expect(actual.toSnapshot()).toStrictEqual(expected.toSnapshot());
    }
  };
}
