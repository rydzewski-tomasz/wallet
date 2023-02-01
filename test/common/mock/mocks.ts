import { ExpenditureCategoryRepository } from '../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { AuthUserRepository } from '../../../src/auth/user/authUserRepository';
import { UuidGenerator } from '../../../src/core/uuidGenerator';
import { AuthUserFactory } from '../../../src/auth/user/authUserFactory';
import { AuthUserService } from '../../../src/auth/user/authUserService';
import { HashService } from '../../../src/auth/user/hashService';

export function createUserFactoryMock(): AuthUserFactory {
  return { create: jest.fn() };
}

export function expenditureCategoryRepositoryMock(): ExpenditureCategoryRepository {
  return { save: jest.fn() };
}

export function createUserRepositoryMock(): AuthUserRepository {
  return { save: jest.fn(), findByUuid: jest.fn(), findByUsername: jest.fn() };
}

export function createUuidGeneratorMock(): UuidGenerator {
  return { generate: jest.fn() };
}

export function createHashServiceMock(): HashService {
  return { generateHash: jest.fn() };
}

export function createAuthUserServiceMock(): AuthUserService {
  return {
    signup: jest.fn()
  };
}
