import Koa from 'koa';
import { createUserRouter } from '../../../src/user/userRouter';
import { Server } from 'net';
import { Request } from '../../common/setup/request';
import { expectResponse } from '../../common/util/expectUtil';
import { errorMiddleware, HttpDefaultError } from '../../../src/core/http/errorMiddleware';
import { SignupErrorType, UserService } from '../../../src/user/userService';
import { createUserServiceMock } from '../../common/mock/mocks';
import { createErrorResult, createSuccessResult } from '../../../src/core/result';
import { userBuilder } from '../../common/builder/userBuilder';

describe('userHttpApi integration test', () => {
  let server: Server;
  let request: Request;
  let userService: UserService;

  beforeAll(() => {
    const app = new Koa();
    userService = createUserServiceMock()
    const userRouter = createUserRouter(userService);
    app.use(errorMiddleware)
    app.use(userRouter.middleware());
    server = app.listen(0);
    request = new Request(server);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
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
