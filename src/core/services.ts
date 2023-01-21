import { UserRepository, UserRepositoryImpl } from '../auth/user/userRepository';
import { ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../budget/expenditure/category/expenditureCategoryService';
import { UserService, UserServiceImpl } from '../auth/user/userService';
import { UserFactory, UserFactoryImpl } from '../auth/user/userFactory';
import { AppParams } from '../app';
import { UuidGenerator } from './uuidGenerator';
import { DbConnection } from './db/dbConnection';

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
  const { userRepository, expenditureCategoryRepository } = createRepositories(appParams.dbConnection);
  const { userFactory, uuidGenerator } = createUtils(appParams);

  return {
    userService: new UserServiceImpl({ userRepository, userFactory }),
    expenditureCategoryService: new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository, uuidGenerator })
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
