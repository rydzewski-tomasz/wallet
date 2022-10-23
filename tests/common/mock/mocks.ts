import { ExpenditureCategoryRepository } from '../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { UserRepository } from '../../../src/user/userRepository';
import { UuidGenerator } from '../../../src/core/uuidGenerator';
import { UserFactory } from '../../../src/user/userFactory';

export function createUserFactoryMock(): UserFactory {
  return { create: jest.fn() };
}

export function expenditureCategoryRepositoryMock(): ExpenditureCategoryRepository {
  return { save: jest.fn() };
}

export function createUserRepositoryMock(): UserRepository {
  return { save: jest.fn(), findByUuid: jest.fn(), findByLogin: jest.fn() };
}

export function createUuidGeneratorMock(): UuidGenerator {
  return { generate: jest.fn() };
}
