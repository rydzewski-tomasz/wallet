import { Request } from '../../common/setup/request';
import { expectResponse } from '../../common/util/expectUtil';
import { createExpenditureCategoryRouter } from '../../../src/budget/expenditure/category/expenditureCategoryRouter';
import { jest } from '@jest/globals';
import { initHttpEnv } from '../../common/setup/initHttpEnv';

describe('addExpenditureCategoryHttpApi integration test', () => {
  const { startServer, stopServer } = initHttpEnv();

  let request: Request;

  beforeAll(() => {
    request = startServer(() => createExpenditureCategoryRouter());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    stopServer();
  });

  it('GIVEN request with invalid body WHEN addExpenditureCategory THEN return 400 http status with invalid body error type', async () => {
    // GIVEN
    const invalidRequestBody = {};

    // WHEN
    const response = await request.post('/budget/expenditure/category', invalidRequestBody);

    // THEN
    expectResponse(response).toBeError(400, 'InvalidBody');
  });
});
