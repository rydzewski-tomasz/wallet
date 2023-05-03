import { initDbEnv } from '../../../common/setup/initDbEnv';
import { DbConnection } from '../../../../src/core/db/dbConnection';
import { USER_TABLE_NAME, AuthUserRepository, UserRepositoryImpl } from '../../../../src/auth/user/authUserRepository';
import { UserStatus, UserType } from '../../../../src/auth/user/authUser';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { expectEntity } from '../../../common/util/expectUtil';
import { AuthUserFactory, AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { createAccessTokenFactoryMock, createHashServiceMock, createUuidGeneratorMock } from '../../../common/mock/mocks';

describe('userRepository integration test', () => {
  const { createConnection, closeConnection } = initDbEnv();
  let dbConnection: DbConnection;
  let userRepository: AuthUserRepository;

  beforeAll(async () => {
    const userFactory: AuthUserFactory = new AuthUserFactoryImpl({
      uuidGenerator: createUuidGeneratorMock(),
      hashService: createHashServiceMock(),
      accessTokenFactory: createAccessTokenFactoryMock()
    });
    dbConnection = await createConnection();
    userRepository = new UserRepositoryImpl({ dbConnection, userFactory });
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
    const notExistingUuid = 'notExisting';

    // WHEN
    const result = await userRepository.findByUuid(notExistingUuid);

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing uuid WHEN findByUuid THEN return existing user', async () => {
    // GIVEN
    const userOnDb = {
      uuid: 'testUuid',
      username: 'test_login',
      password: 'xxxxyyyyzzzz',
      status: UserStatus.Active,
      created: '2022-01-01 10:00:00',
      type: UserType.User,
      updated: '2022-01-30 10:00:00'
    };
    await dbConnection.db(USER_TABLE_NAME).insert(userOnDb);

    // WHEN
    const result = await userRepository.findByUuid('testUuid');

    // THEN
    const expected = authUserBuilder().withUuid('testUuid').withUsername('test_login').withPasswordHash('xxxxyyyyzzzz').withStatus(UserStatus.Active).valueOf();
    expectEntity(result).toHaveEqualValue(expected);
  });

  it('GIVEN valid not existing user WHEN save THEN insert new user into db', async () => {
    // GIVEN
    const user = authUserBuilder()
      .withUuid('testUuid')
      .withUsername('test_login')
      .withPasswordHash('$2a$10$Pjwx7nJKXjPrbikNIqXEXOZ9ngz/bQtvvC7rE.3GGvZEyjD8I.XLy')
      .withStatus(UserStatus.Active)
      .valueOf();

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid('testUuid');
    expectEntity(onDb).toHaveEqualValue(user);
  });

  it('GIVEN valid existing user WHEN save THEN update user on db', async () => {
    // GIVEN
    const user = authUserBuilder().withUuid('testUuid').withUsername('test_name').withPasswordHash('aaaa-aaaa').withStatus(UserStatus.Active).valueOf();
    await userRepository.save(user);
    user.remove();

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid('testUuid');
    const expected = authUserBuilder().withUuid('testUuid').withUsername('test_name').withPasswordHash('aaaa-aaaa').withStatus(UserStatus.Deleted).valueOf();
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