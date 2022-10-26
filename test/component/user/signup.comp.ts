import { initFullEnv } from '../../common/setup/initFullEnv';
import { Request } from '../../common/setup/request';
import { expectResponse } from '../../common/util/expectUtil';
import { createUserRepository, USER_TABLE_NAME, UserRepository } from '../../../src/user/userRepository';
import { userBuilder } from '../../common/builder/userBuilder';
import { UserStatus } from '../../../src/user/user';
import bcrypt from 'bcryptjs';
import { DbConnection } from '../../../src/core/db/dbConnection';

describe('signup component test', () => {
  const { startEnv, stopEnv } = initFullEnv();
  let request: Request;
  let userRepository: UserRepository;
  let dbConnection: DbConnection;

  beforeAll(async () => {
    const { request: innRequest, dbConnection: dbConnectionInn } = await startEnv();
    request = innRequest;
    dbConnection = dbConnectionInn;
    userRepository = createUserRepository({ dbConnection });
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
    expectResponse(response).toBeSuccess(200, { uuid: expect.any(String) });
  });

  it('GIVEN valid request WHEN signup THEN save user on db', async () => {
    // GIVEN
    const requestBody = { username: 'test', password: 'pass' };

    // WHEN
    const response = await request.post('/user/signup', requestBody);

    // THEN
    const { uuid } = response.body;
    const onDb = (await userRepository.findByUuid(uuid))?.toSnapshot();
    const expected = userBuilder().withUuid(uuid).withStatus(UserStatus.New).withUsername('test').valueOf();
    expect({ ...onDb, isValidPassword: await bcrypt.compare('pass', onDb?.passwordHash || '') }).toStrictEqual({
      ...expected.toSnapshot(),
      passwordHash: expect.any(String),
      isValidPassword: true
    });
  });
});
