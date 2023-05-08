import { initFullEnv } from '../../../common/setup/initFullEnv';
import { Request } from '../../../common/setup/request';
import { expectResponse } from '../../../common/util/expectUtil';
import { AuthUserRepository, createAuthUserRepository, USER_TABLE_NAME } from '../../../../src/auth/user/authUserRepository';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { UserStatus } from '../../../../src/auth/user/authUser';
import bcrypt from 'bcryptjs';
import { DbConnection } from '../../../../src/core/db/dbConnection';
import { AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { createAccessTokenFactoryMock } from '../../../common/mock/mocks';
import { Guid } from '../../../../src/core/guid';

describe('signup component test', () => {
  const { startEnv, stopEnv } = initFullEnv();
  let request: Request;
  let userRepository: AuthUserRepository;
  let dbConnection: DbConnection;

  beforeAll(async () => {
    const { request: innRequest, dbConnection: dbConnectionInn } = await startEnv();
    const userFactory = new AuthUserFactoryImpl({
      accessTokenFactory: createAccessTokenFactoryMock()
    });
    request = innRequest;
    dbConnection = dbConnectionInn;
    userRepository = createAuthUserRepository({ dbConnection, userFactory });
  });

  afterEach(async () => {
    await dbConnection.db(USER_TABLE_NAME).del();
  });

  afterAll(async () => {
    await stopEnv();
  });

  it('GIVEN valid request WHEN signup THEN return 200 status', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'pass' };

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    expectResponse(response).toBeSuccess(200, { id: expect.any(String) });
  });

  it('GIVEN valid request WHEN signup THEN save user on db', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'pass' };

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    const { id } = response.body;
    const onDb = (await userRepository.findByUuid(Guid.fromUuid(id)))?.toSnapshot();
    const expected = authUserBuilder().withId(Guid.fromUuid(id)).withStatus(UserStatus.Unverified).withUsername('test').valueOf();
    expect({ ...onDb, isValidPassword: await bcrypt.compare('pass', onDb?.passwordHash || '') }).toStrictEqual({
      ...expected.toSnapshot(),
      passwordHash: expect.any(String),
      isValidPassword: true
    });
  });
});
