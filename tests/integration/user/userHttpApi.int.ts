import { createUserRouter } from '../../../src/user/userRouter';
import { Request } from '../../common/setup/request';
import { expectResponse } from '../../common/util/expectUtil';
import { HttpDefaultError } from '../../../src/core/http/errorMiddleware';
import { SignupErrorType, UserService } from '../../../src/user/userService';
import { createErrorResult, createSuccessResult } from '../../../src/core/result';
import { userBuilder } from '../../common/builder/userBuilder';
import { initHttpEnv } from '../../common/setup/initHttpEnv';
import { createUserServiceMock } from '../../common/mock/mocks';

describe('userHttpApi integration test', () => {
  const { startServer, stopServer } = initHttpEnv();

  let request: Request;
  let userService: UserService;

  beforeAll(() => {
    userService = createUserServiceMock()
    request = startServer(() => createUserRouter(userService));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    stopServer();
  });

  it('GIVEN invalid request body WHEN signup THEN return 400 status', async () => {
    // GIVEN
    const invalidRequestBody = { login: 'test', invalidPassword: 'pass' };

    // WHEN
    const response = await request.post('/user/signup', invalidRequestBody);

    // THEN
    expectResponse(response).toBeError(400, HttpDefaultError.InvalidBody);
  });

  it('GIVEN LoginAlreadyExists error from service WHEN signup THEN return 400 status', async () => {
    // GIVEN
    const requestBody = { login: 'test', password: 'pass' };
    jest.spyOn(userService, 'signup').mockResolvedValueOnce(createErrorResult(SignupErrorType.LoginAlreadyExists));

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeError(400, SignupErrorType.LoginAlreadyExists);
  });

  it('GIVEN success result from service WHEN signup THEN return 200 status', async () => {
    // GIVEN
    const requestBody = { login: 'test', password: 'pass' };
    const user = userBuilder().withUuid('testUuid').valueOf();
    jest.spyOn(userService, 'signup').mockResolvedValueOnce(createSuccessResult(user));

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { uuid: 'testUuid' });
  });
});
