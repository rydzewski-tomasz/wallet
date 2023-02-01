import { AuthUserRepository } from './authUserRepository';
import { AuthUser } from './authUser';
import { AuthUserFactory } from './authUserFactory';
import { createErrorResult, createSuccessResult, Result } from '../../core/result';
import { HashService } from './hashService';

export enum SignupErrorType {
  UsernameAlreadyExists = 'UsernameAlreadyExists'
}

export interface AuthUserService {
  signup: (input: { username: string; password: string }) => Promise<Result<AuthUser, SignupErrorType>>;
}

export class UserServiceImpl implements AuthUserService {
  private userRepository: AuthUserRepository;
  private userFactory: AuthUserFactory;
  private hashService: HashService;

  constructor({ userRepository, userFactory, hashService }: { userRepository: AuthUserRepository; userFactory: AuthUserFactory; hashService: HashService }) {
    this.userRepository = userRepository;
    this.userFactory = userFactory;
    this.hashService = hashService;
  }

  async signup({ username, password }: { username: string; password: string }): Promise<Result<AuthUser, SignupErrorType>> {
    if (await this.userRepository.findByUsername(username)) {
      return createErrorResult(SignupErrorType.UsernameAlreadyExists);
    }

    const user = this.userFactory.create();
    await user.signup({ username, password, generateHash: this.hashService.generateHash });
    await this.userRepository.save(user);
    return createSuccessResult(user);
  }
}
