import { AuthUserService, LoginErrorType, SignupErrorType, AuthUserServiceImpl } from '../../../../src/auth/user/authUserService';
import { createUserFactoryMock, createUserRepositoryMock } from '../../../common/mock/mocks';
import { AuthUserRepository } from '../../../../src/auth/user/authUserRepository';
import { AuthUser, UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactory } from '../../../../src/auth/user/authUserFactory';
import { expectResultEntity } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { hashService } from '../../../../src/auth/user/hashService';

describe('AuthUserService.signup unit test', () => {
  let authUserService: AuthUserService;
  let authUserRepository: AuthUserRepository;
  let authUserFactory: AuthUserFactory;
  let authUser: AuthUser;

  beforeEach(() => {
    authUserRepository = createUserRepositoryMock();
    authUserFactory = createUserFactoryMock();
    authUserService = new AuthUserServiceImpl({ userRepository: authUserRepository, userFactory: authUserFactory });
    authUser = authUserBuilder().withStatus(UserStatus.New).valueOf();

    jest.spyOn(authUserFactory, 'create').mockReturnValue(authUser);
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid username and password WHEN signup THEN return new user with valid props', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';

    // WHEN
    const result = await authUserService.signup({ username, password });

    // THEN
    expectResultEntity(result).toBeSuccess(authUser);
  });

  it('GIVEN existing username WHEN signup THEN return LoginAlreadyExists error', async () => {
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

describe('AuthUserService.login unit test', () => {
  let authUserService: AuthUserService;
  let authUserRepository: AuthUserRepository;
  let authUser: AuthUser;

  beforeEach(() => {
    authUserRepository = createUserRepositoryMock();
    authUser = authUserBuilder().withStatus(UserStatus.Active).valueOf();
    authUserService = new AuthUserServiceImpl({ userRepository: authUserRepository, userFactory: createUserFactoryMock() });

    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValue(authUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN non existing username WHEN login THEN return InvalidLogin error', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValue(null);

    // WHEN
    const result = await authUserService.login({ username, password });

    // THEN
    expectResultEntity(result).toBeError(LoginErrorType.UserNotFound);
  });

  it('GIVEN existing username and invalid password WHEN login THEN return InvalidPassword error', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'invalidPassword';
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValueOnce(authUserBuilder().valueOf());

    // WHEN
    const result = await authUserService.login({ username, password });

    // THEN
    expectResultEntity(result).toBeError(LoginErrorType.InvalidPassword);
  });

  it('GIVEN existing username and valid password WHEN login THEN return user with valid props', async () => {
    // GIVEN
    const username = 'testLogin';
    const password = 'testPassword';
    const passwordHash = await hashService.generateHash(password);
    const user = authUserBuilder().withStatus(UserStatus.Active).withPasswordHash(passwordHash).valueOf();
    jest.spyOn(authUserRepository, 'findByUsername').mockResolvedValue(user);

    // WHEN
    const result = await authUserService.login({ username, password });

    // THEN
    expectResultEntity(result).toBeSuccess(authUser);
  });
});
