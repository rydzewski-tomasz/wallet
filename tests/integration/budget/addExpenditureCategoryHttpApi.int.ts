import { initHttpEnv } from '../../common/setup/initHttpEnv';
import { Request } from '../../common/setup/request';
import { expectResponse } from '../../common/util/expectUtil';

describe('addExpenditureCategoryHttpApi integration test', () => {
  const { startServer, stopServer } = initHttpEnv();
  let request: Request;

  beforeAll(() => {
    request = startServer();
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
