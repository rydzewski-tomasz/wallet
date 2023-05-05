import { AuthUserRepository } from '../../../src/auth/user/authUserRepository';
import { AuthUserFactory } from '../../../src/auth/user/authUserFactory';
import { AuthUserService } from '../../../src/auth/user/authUserService';
import { AccessTokenFactory } from '../../../src/auth/user/accessTokenFactory';

export function createUserFactoryMock(): AuthUserFactory {
  return { create: jest.fn(), createActions: jest.fn(), createProps: jest.fn() };
}

export function createUserRepositoryMock(): AuthUserRepository {
  return { save: jest.fn(), findByUuid: jest.fn(), findByUsername: jest.fn() };
}

export function createAccessTokenFactoryMock(): AccessTokenFactory {
  return { create: jest.fn() };
}

export function createAuthUserServiceMock(): AuthUserService {
  return {
    signup: jest.fn(),
    login: jest.fn()
  };
}
