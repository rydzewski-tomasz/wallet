import { initDbEnv } from '../../common/setup/initDbEnv';
import { DbConnection } from '../../../src/core/db/dbConnection';
import { USER_TABLE_NAME, UserRepository, UserRepositoryImpl } from '../../../src/user/userRepository';
import { User, UserStatus } from '../../../src/user/user';
import { userBuilder } from '../../common/builder/userBuilder';
import { expectEntity } from '../../common/util/expectUtil';

describe('userRepository integration test', () => {
  const { createConnection, closeConnection } = initDbEnv();
  let dbConnection: DbConnection;
  let userRepository: UserRepository;

  beforeAll(async () => {
    dbConnection = await createConnection();
    userRepository = new UserRepositoryImpl(dbConnection);
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
      updated: '2022-01-30 10:00:00'
    };
    await dbConnection.db(USER_TABLE_NAME).insert(userOnDb);

    // WHEN
    const result = await userRepository.findByUuid('testUuid');

    // THEN
    const expected = new User({
      uuid: 'testUuid',
      username: 'test_login',
      passwordHash: 'xxxxyyyyzzzz',
      status: UserStatus.Active
    });
    expect(result).toStrictEqual(expected);
  });

  it('GIVEN valid not existing user WHEN save THEN insert new user into db', async () => {
    // GIVEN
    const user = new User({
      uuid: 'testUuid',
      username: 'test_login',
      passwordHash: '$2a$10$Pjwx7nJKXjPrbikNIqXEXOZ9ngz/bQtvvC7rE.3GGvZEyjD8I.XLy',
      status: UserStatus.Active
    });

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid('testUuid');
    expect(onDb).toStrictEqual(user);
  });

  it('GIVEN valid existing user WHEN save THEN update user on db', async () => {
    // GIVEN
    const user = new User({ uuid: 'testUuid', username: 'test_name', passwordHash: 'aaaa-aaaa', status: UserStatus.Active });
    await userRepository.save(user);
    user.remove();

    // WHEN
    await userRepository.save(user);

    // THEN
    const onDb = await userRepository.findByUuid('testUuid');
    const expected = new User({ uuid: 'testUuid', username: 'test_name', passwordHash: 'aaaa-aaaa', status: UserStatus.Deleted });
    expect(onDb).toStrictEqual(expected);
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
    const user = userBuilder().withUsername(username).valueOf();
    await userRepository.save(user);

    // WHEN
    const result = await userRepository.findByUsername(username);

    // THEN
    expectEntity(result).toStrictEqual(user);
  });
});
