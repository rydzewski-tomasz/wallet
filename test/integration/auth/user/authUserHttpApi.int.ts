import { createUserRouter } from '../../../../src/auth/user/authUserRouter';
import { Request } from '../../../common/setup/request';
import { expectResponse } from '../../../common/util/expectUtil';
import { HttpDefaultError } from '../../../../src/core/http/errorMiddleware';
import { AuthUserService, LoginErrorType, SignupErrorType } from '../../../../src/auth/user/authUserService';
import { createErrorResult, createSuccessResult } from '../../../../src/core/result';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { initHttpEnv } from '../../../common/setup/initHttpEnv';
import { createAuthUserServiceMock } from '../../../common/mock/mocks';
import { accessTokenBuilder } from '../../../common/builder/authTokensBuilder';
import { Guid } from '../../../../src/core/guid';

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
    const user = authUserBuilder().withId(Guid.fromUuid('46abb3ac-e640-4c35-8726-bcdcc1ba2b16')).valueOf();
    jest.spyOn(authUserService, 'signup').mockResolvedValueOnce(createSuccessResult(user));

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { id: '46abb3ac-e640-4c35-8726-bcdcc1ba2b16' });
  });

  it('GIVEN invalid request body WHEN login THEN return 400 status', async () => {
    // GIVEN
    const invalidRequestBody = { username: 'test', invalidField: 'pass' };

    // WHEN
    const response = await request.post('/user/login', invalidRequestBody);

    // THEN
    expectResponse(response).toBeError(400, HttpDefaultError.InvalidBody);
  });

  it('GIVEN UserNotFound error on sign in WHEN login THEN return 404 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'testPassword' };
    jest.spyOn(authUserService, 'login').mockResolvedValueOnce(createErrorResult(LoginErrorType.UserNotFound));

    // WHEN
    const response = await request.post('/user/login', requestBody);

    // THEN
    expectResponse(response).toBeError(404, LoginErrorType.UserNotFound);
  });

  it('GIVEN InvalidPassword error on sign in WHEN login THEN return 404 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'testPassword' };
    jest.spyOn(authUserService, 'login').mockResolvedValueOnce(createErrorResult(LoginErrorType.InvalidPassword));

    // WHEN
    const response = await request.post('/user/login', requestBody);

    // THEN
    expectResponse(response).toBeError(401, LoginErrorType.InvalidPassword);
  });

  it('GIVEN successful sign in WHEN login THEN return 200 with tokens', async () => {
    // GIVEN
    const accessToken = accessTokenBuilder().withToken('accessTokenValue').value();
    const user = authUserBuilder().withAccessToken(accessToken).valueOf();
    const requestBody = { username: 'test', password: 'testPassword' };
    jest.spyOn(authUserService, 'login').mockResolvedValueOnce(createSuccessResult(user));

    // WHEN
    const response = await request.post('/user/login', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { accessToken: 'accessTokenValue' });
  });
});
