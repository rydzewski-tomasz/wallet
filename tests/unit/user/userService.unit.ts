import { UserService } from '../../../src/user/userService';
import { createUserFactoryMock, createUserRepositoryMock } from '../../common/mock/mocks';
import { UserRepository } from '../../../src/user/userRepository';
import { User, UserStatus } from '../../../src/user/user';
import { UserFactory } from '../../../src/user/userFactory';

describe('UserService unit test', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let userFactory: UserFactory;

  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    userFactory = createUserFactoryMock();
    userService = new UserService(userRepository, userFactory);
  });

  it('GIVEN valid login and password WHEN signup THEN return new user with valid props', async () => {
    // GIVEN
    const login = 'testLogin';
    const password = 'testPassword';
    jest.spyOn(userFactory, 'create').mockReturnValue(new User({
      uuid: 'testUuid',
      login: '',
      passwordHash: '',
      status: UserStatus.New
    }));
    
    // WHEN
    const result = await userService.signup({ login, password });
  
    // THEN
    const snapshot = result.toSnapshot();
    expect({
      uuid: snapshot.uuid,
      login: snapshot.login,
      status: snapshot.status
    }).toStrictEqual({
      uuid: 'testUuid',
      login: 'testLogin',
      status: UserStatus.New
    });
  });
  
});
