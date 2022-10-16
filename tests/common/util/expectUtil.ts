import { ErrorHttpStatus, SuccessHttpStatus } from '../../../src/core/http/httpResponse';
import { Response } from 'superagent'

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

