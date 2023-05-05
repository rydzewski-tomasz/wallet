import { initFullEnv } from '../../../common/setup/initFullEnv';
import { Request } from '../../../common/setup/request';
import { DbConnection } from '../../../../src/core/db/dbConnection';
import { AuthUserRepository, createUserRepository, USER_TABLE_NAME } from '../../../../src/auth/user/authUserRepository';
import { expectResponse } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { AccessTokenFactoryImpl } from '../../../../src/auth/user/accessTokenFactory';
import testConfig from '../../../common/config/testConfig';

describe('login component test', () => {
  const { startEnv, stopEnv } = initFullEnv();
  let request: Request;
  let userRepository: AuthUserRepository;
  let dbConnection: DbConnection;

  beforeAll(async () => {
    const { request: innRequest, dbConnection: dbConnectionInn } = await startEnv();
    request = innRequest;
    dbConnection = dbConnectionInn;
    const userFactory = new AuthUserFactoryImpl({
      accessTokenFactory: new AccessTokenFactoryImpl({ config: testConfig.getAppConfig() })
    });
    userRepository = createUserRepository({ dbConnection, userFactory });
  });

  afterEach(async () => {
    await dbConnection.db(USER_TABLE_NAME).del();
  });

  afterAll(async () => {
    await stopEnv();
  });

  it('GIVEN valid request WHEN login THEN return 200 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'testPassword' };
    const user = authUserBuilder()
      .withUuid('testUuid')
      .withStatus(UserStatus.Active)
      .withUsername('test')
      .withPasswordHash('$2a$10$Hu/UkfhRr1P7pgVwRwAAc.snob8zlcr3lK7.258Q6Oi/5JZVdcFpS')
      .valueOf();
    await userRepository.save(user);

    // WHEN
    const response = await request.post('/user/login', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { accessToken: expect.any(String) });
  });
});
