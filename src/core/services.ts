import { UserRepository, UserRepositoryImpl } from '../user/userRepository';
import { ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../budget/expenditure/category/expenditureCategoryService';
import { UserService, UserServiceImpl } from '../user/userService';
import { UserFactory, UserFactoryImpl } from '../user/userFactory';
import { AppParams } from '../app';
import { UuidGenerator } from './uuidGenerator';
import { DbConnection } from './db/dbConnection';
import Koa from 'koa';

export interface Repositories {
  userRepository: UserRepository;
  expenditureCategoryRepository: ExpenditureCategoryRepository;
}

export interface Services {
  userService: UserService;
  expenditureCategoryService: ExpenditureCategoryService;
}

export interface Utils {
  userFactory: UserFactory;
  uuidGenerator: UuidGenerator;
  dbConnection: DbConnection;
}

export function createServices(appParams: AppParams): Services {
  const repositories = createRepositories(appParams.dbConnection);
  const utils = createUtils(appParams);

  return {
    userService: new UserServiceImpl(repositories.userRepository, utils.userFactory),
    expenditureCategoryService: new ExpenditureCategoryServiceImpl(repositories.expenditureCategoryRepository, utils.uuidGenerator)
  };
}

function createUtils({ dbConnection }: AppParams): Utils {
  const uuidGenerator = new UuidGenerator();

  return {
    userFactory: new UserFactoryImpl(uuidGenerator),
    uuidGenerator,
    dbConnection
  };
}

function createRepositories(dbConnection: DbConnection): Repositories {
  return {
    userRepository: new UserRepositoryImpl(dbConnection),
    expenditureCategoryRepository: new ExpenditureCategoryRepositoryImpl(dbConnection)
  };
}

