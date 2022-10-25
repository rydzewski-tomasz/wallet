import { SignupErrorType, UserService, UserServiceImpl } from '../../../src/user/userService';
import { createUserFactoryMock, createUserRepositoryMock } from '../../common/mock/mocks';
import { UserRepository } from '../../../src/user/userRepository';
import { User, UserStatus } from '../../../src/user/user';
import { UserFactory } from '../../../src/user/userFactory';
import { expectResultEntity } from '../../common/util/expectUtil';
import { userBuilder } from '../../common/builder/userBuilder';

describe('UserService unit test', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let userFactory: UserFactory;
  let user: User;

  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    userFactory = createUserFactoryMock();
    userService = new UserServiceImpl(userRepository, userFactory);
    user = userBuilder().withStatus(UserStatus.New).valueOf();

    jest.spyOn(userFactory, 'create').mockReturnValue(user);
    jest.spyOn(userRepository, 'findByLogin').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid login and password WHEN signup THEN return new user with valid props', async () => {
    // GIVEN
    const login = 'testLogin';
    const password = 'testPassword';

    // WHEN
    const result = await userService.signup({ login, password });

    // THEN
    expectResultEntity(result).toBeSuccess(user);
  });

  it('GIVEN existing login WHEN signup THEN return LoginAlreadyExists error', async () => {
    // GIVEN
    const login = 'testLogin';
    const password = 'testPassword';
    jest.spyOn(userRepository, 'findByLogin').mockResolvedValueOnce(userBuilder().valueOf());

    // WHEN
    const result = await userService.signup({ login, password });

    // THEN
    expectResultEntity(result).toBeError(SignupErrorType.LoginAlreadyExists);
  });
});
