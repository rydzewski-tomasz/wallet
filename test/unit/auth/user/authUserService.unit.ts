import { SignupErrorType, AuthUserService, UserServiceImpl } from '../../../../src/auth/user/authUserService';
import { createHashServiceMock, createUserFactoryMock, createUserRepositoryMock } from '../../../common/mock/mocks';
import { AuthUserRepository } from '../../../../src/auth/user/authUserRepository';
import { AuthUser, UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactory } from '../../../../src/auth/user/authUserFactory';
import { expectResultEntity } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';

describe('AuthUserService unit test', () => {
  let authUserService: AuthUserService;
  let authUserRepository: AuthUserRepository;
  let authUserFactory: AuthUserFactory;
  let authUser: AuthUser;

  beforeEach(() => {
    authUserRepository = createUserRepositoryMock();
    authUserFactory = createUserFactoryMock();
    authUserService = new UserServiceImpl({ userRepository: authUserRepository, userFactory: authUserFactory, hashService: createHashServiceMock() });
    authUser = authUserBuilder().withStatus(UserStatus.New).valueOf();

    jest.spyOn(authUserFactory, 'create').mockReturnValue(authUser);
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid login and password WHEN signup THEN return new user with valid props', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';

    // WHEN
    const result = await authUserService.signup({ username, password });

    // THEN
    expectResultEntity(result).toBeSuccess(authUser);
  });

  it('GIVEN existing login WHEN signup THEN return LoginAlreadyExists error', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValueOnce(authUserBuilder().valueOf());

    // WHEN
    const result = await authUserService.signup({ username, password });

    // THEN
    expectResultEntity(result).toBeError(SignupErrorType.UsernameAlreadyExists);
  });
});
