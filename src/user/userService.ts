import { UserRepository } from './userRepository';
import { User } from './user';
import { UserFactory } from './userFactory';
import { createErrorResult, createSuccessResult, Result } from '../core/result';

export enum SignupErrorType {
  LoginAlreadyExists = 'LoginAlreadyExists'
}

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userFactory: UserFactory
  ) { }
  
  async signup({ login, password }: { login: string, password: string }): Promise<Result<User, SignupErrorType.LoginAlreadyExists>> {
    if (await this.userRepository.findByLogin(login)) {
      return createErrorResult(SignupErrorType.LoginAlreadyExists);
    }

    const user = this.userFactory.create();
    await user.signup({ login, password });
    await this.userRepository.save(user);
    return createSuccessResult(user);
  }
}
