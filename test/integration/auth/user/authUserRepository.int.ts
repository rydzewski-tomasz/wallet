import { initDbEnv } from '../../../common/setup/initDbEnv';
import { DbConnection } from '../../../../src/core/db/dbConnection';
import { USER_TABLE_NAME, AuthUserRepository, AuthUserRepositoryImpl } from '../../../../src/auth/user/authUserRepository';
import { UserStatus, UserType } from '../../../../src/auth/user/authUser';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { expectEntity } from '../../../common/util/expectUtil';
import { AuthUserFactory, AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { createAccessTokenFactoryMock } from '../../../common/mock/mocks';
import { Guid } from '../../../../src/core/guid';

describe('userRepository integration test', () => {
  const { createConnection, closeConnection } = initDbEnv();
  let dbConnection: DbConnection;
  let userRepository: AuthUserRepository;

  beforeAll(async () => {
    const userFactory: AuthUserFactory = new AuthUserFactoryImpl({
      accessTokenFactory: createAccessTokenFactoryMock()
    });
    dbConnection = await createConnection();
    userRepository = new AuthUserRepositoryImpl({ dbConnection, userFactory });
  });

  afterEach(async () => {
    await dbConnection.db(USER_TABLE_NAME).del();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN existing uuid WHEN findByUuid THEN return existing user', async () => {
    // GIVEN
    const notExistingUuid = 'e9a7baf1-4250-4a6b-940c-1e4385f11687';

    // WHEN
    const result = await userRepository.findByUuid(Guid.fromUuid(notExistingUuid));

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing uuid WHEN findByUuid THEN return existing user', async () => {
    // GIVEN
    const userOnDb = {
      id: 'e9a7baf1-4250-4a6b-940c-1e4385f11687',
      username: 'test_login',
      password: 'xxxxyyyyzzzz',
      status: UserStatus.Active,
      created: '2022-01-01 10:00:00',
      type: UserType.User,
      updated: '2022-01-30 10:00:00'
    };
    await dbConnection.db(USER_TABLE_NAME).insert(userOnDb);

    // WHEN
    const result = await userRepository.findByUuid(Guid.fromUuid('e9a7baf1-4250-4a6b-940c-1e4385f11687'));

    // THEN
    const expected = authUserBuilder()
      .withId(Guid.fromUuid('e9a7baf1-4250-4a6b-940c-1e4385f11687'))
      .withUsername('test_login')
      .withPasswordHash('xxxxyyyyzzzz')
      .withStatus(UserStatus.Active)
      .valueOf();
    expectEntity(result).toHaveEqualValue(expected);
  });

  it('GIVEN valid not existing user WHEN save THEN insert new user into db', async () => {
    // GIVEN
    const user = authUserBuilder()
      .withId(Guid.fromUuid('2f869ac0-00a3-425e-a4c0-6aae5b485db4'))
      .withUsername('test_login')
      .withPasswordHash('$2a$10$Pjwx7nJKXjPrbikNIqXEXOZ9ngz/bQtvvC7rE.3GGvZEyjD8I.XLy')
      .withStatus(UserStatus.Active)
      .valueOf();

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid(Guid.fromUuid('2f869ac0-00a3-425e-a4c0-6aae5b485db4'));
    expectEntity(onDb).toHaveEqualValue(user);
  });

  it('GIVEN valid existing user WHEN save THEN update user on db', async () => {
    // GIVEN
    const user = authUserBuilder()
      .withId(Guid.fromUuid('82d6c2d8-b7ef-4200-a1e4-05af814004bc'))
      .withUsername('test_name')
      .withPasswordHash('aaaa-aaaa')
      .withStatus(UserStatus.Active)
      .valueOf();
    await userRepository.save(user);
    user.remove();

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid(Guid.fromUuid('82d6c2d8-b7ef-4200-a1e4-05af814004bc'));
    const expected = authUserBuilder()
      .withId(Guid.fromUuid('82d6c2d8-b7ef-4200-a1e4-05af814004bc'))
      .withUsername('test_name')
      .withPasswordHash('aaaa-aaaa')
      .withStatus(UserStatus.Deleted)
      .valueOf();
    expectEntity(onDb).toHaveEqualValue(expected);
  });

  it('GIVEN not existing user login WHEN findByLogin THEN return null', async () => {
    // GIVEN
    const login = 'nonExisting';

    // WHEN
    const result = await userRepository.findByUsername(login);

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing user login WHEN findByLogin THEN return user', async () => {
    // GIVEN
    const username = 'existing';
    const user = authUserBuilder().withUsername(username).valueOf();
    await userRepository.save(user);

    // WHEN
    const result = await userRepository.findByUsername(username);

    // THEN
    expectEntity(result).toHaveEqualValue(user);
  });
});
