import { createUserRouter } from '../../../../src/auth/user/authUserRouter';
import { Request } from '../../../common/setup/request';
import { expectResponse } from '../../../common/util/expectUtil';
import { HttpDefaultError } from '../../../../src/core/http/errorMiddleware';
import { SignupErrorType, AuthUserService } from '../../../../src/auth/user/authUserService';
import { createErrorResult, createSuccessResult } from '../../../../src/core/result';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { initHttpEnv } from '../../../common/setup/initHttpEnv';
import { createAuthUserServiceMock } from '../../../common/mock/mocks';

describe('userHttpApi integration test', () => {
  const { startServer, stopServer } = initHttpEnv();

  let request: Request;
  let authUserService: AuthUserService;

  beforeAll(() => {
    authUserService = createAuthUserServiceMock();
    request = startServer(() => createUserRouter(authUserService));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    stopServer();
  });

  it('GIVEN invalid request body WHEN signup THEN return 400 status', async () => {
    // GIVEN
    const invalidRequestBody = { username: 'test', invalidPassword: 'pass' };

    // WHEN
    const response = await request.post('/user/signup', invalidRequestBody);

    // THEN
    expectResponse(response).toBeError(400, HttpDefaultError.InvalidBody);
  });

  it('GIVEN LoginAlreadyExists error from service WHEN signup THEN return 400 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'pass' };
    jest.spyOn(authUserService, 'signup').mockResolvedValueOnce(createErrorResult(SignupErrorType.UsernameAlreadyExists));

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeError(400, SignupErrorType.UsernameAlreadyExists);
  });

  it('GIVEN success result from service WHEN signup THEN return 200 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'pass' };
    const user = authUserBuilder().withUuid('testUuid').valueOf();
    jest.spyOn(authUserService, 'signup').mockResolvedValueOnce(createSuccessResult(user));

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { uuid: 'testUuid' });
  });
});
