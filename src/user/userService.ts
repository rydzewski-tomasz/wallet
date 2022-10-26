import { UserRepository } from './userRepository';
import { User } from './user';
import { UserFactory } from './userFactory';
import { createErrorResult, createSuccessResult, Result } from '../core/result';

export enum SignupErrorType {
  UsernameAlreadyExists = 'UsernameAlreadyExists'
}

export interface UserService {
  signup: (input: { username: string; password: string }) => Promise<Result<User, SignupErrorType>>;
}

export class UserServiceImpl implements UserService {
  constructor(private userRepository: UserRepository, private userFactory: UserFactory) {}

  async signup({ username, password }: { username: string; password: string }): Promise<Result<User, SignupErrorType>> {
    if (await this.userRepository.findByUsername(username)) {
      return createErrorResult(SignupErrorType.UsernameAlreadyExists);
    }

    const user = this.userFactory.create();
    await user.signup({ username, password });
    await this.userRepository.save(user);
    return createSuccessResult(user);
  }
}
