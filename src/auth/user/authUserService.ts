import { AuthUserRepository } from './authUserRepository';
import { AuthUser } from './authUser';
import { AuthUserFactory } from './authUserFactory';
import { createErrorResult, createSuccessResult, Result } from '../../core/result';

export enum SignupErrorType {
  UsernameAlreadyExists = 'UsernameAlreadyExists'
}

export enum LoginErrorType {
  UserNotFound = 'UserNotFound',
  InvalidPassword = 'InvalidPassword'
}

export interface AuthUserService {
  signup: (input: { username: string; password: string }) => Promise<Result<AuthUser, SignupErrorType>>;
  login: (input: { username: string; password: string }) => Promise<Result<AuthUser, LoginErrorType>>;
}

export class UserServiceImpl implements AuthUserService {
  private userRepository: AuthUserRepository;
  private userFactory: AuthUserFactory;

  constructor({ userRepository, userFactory }: { userRepository: AuthUserRepository; userFactory: AuthUserFactory }) {
    this.userRepository = userRepository;
    this.userFactory = userFactory;
  }

  async signup({ username, password }: { username: string; password: string }): Promise<Result<AuthUser, SignupErrorType>> {
    if (await this.userRepository.findByUsername(username)) {
      return createErrorResult(SignupErrorType.UsernameAlreadyExists);
    }

    const user = this.userFactory.create();
    await user.signup({ username, password });
    await this.userRepository.save(user);
    return createSuccessResult(user);
  }

  async login({ username, password }: { username: string; password: string }): Promise<Result<AuthUser, LoginErrorType>> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return createErrorResult(LoginErrorType.UserNotFound);
    }

    const result = await user.login({ password });
    return result.isSuccess ? createSuccessResult(user) : createErrorResult(LoginErrorType.InvalidPassword);
  }
}
