import { UserRepository } from './userRepository';
import { User } from './user';
import { UserFactory } from './userFactory';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userFactory: UserFactory
  ) { }
  
  async signup({ login, password }: { login: string, password: string }): Promise<User> {
    const user = this.userFactory.create();
    await user.signup({ login, password });
    await this.userRepository.save(user);
    return user;
  }
}
