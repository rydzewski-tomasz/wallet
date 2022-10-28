import { SignupErrorType, UserService, UserServiceImpl } from '../../../../src/auth/user/userService';
import { createUserFactoryMock, createUserRepositoryMock } from '../../../common/mock/mocks';
import { UserRepository } from '../../../../src/auth/user/userRepository';
import { User, UserStatus } from '../../../../src/auth/user/user';
import { UserFactory } from '../../../../src/auth/user/userFactory';
import { expectResultEntity } from '../../../common/util/expectUtil';
import { userBuilder } from '../../../common/builder/userBuilder';

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
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid login and password WHEN signup THEN return new user with valid props', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';

    // WHEN
    const result = await userService.signup({ username, password });

    // THEN
    expectResultEntity(result).toBeSuccess(user);
  });

  it('GIVEN existing login WHEN signup THEN return LoginAlreadyExists error', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(userBuilder().valueOf());

    // WHEN
    const result = await userService.signup({ username, password });

    // THEN
    expectResultEntity(result).toBeError(SignupErrorType.UsernameAlreadyExists);
  });
});
