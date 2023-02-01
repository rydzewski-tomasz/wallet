import { AuthUserRepository, UserRepositoryImpl } from '../auth/user/authUserRepository';
import { ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../budget/expenditure/category/expenditureCategoryService';
import { AuthUserService, UserServiceImpl } from '../auth/user/authUserService';
import { AuthUserFactory, UserFactoryImpl } from '../auth/user/authUserFactory';
import { AppParams } from '../app';
import { UuidGenerator } from './uuidGenerator';
import { DbConnection } from './db/dbConnection';
import { HashService, HashServiceImpl } from '../auth/user/hashService';

export interface Repositories {
  userRepository: AuthUserRepository;
  expenditureCategoryRepository: ExpenditureCategoryRepository;
}

export interface Services {
  userService: AuthUserService;
  expenditureCategoryService: ExpenditureCategoryService;
  hashService: HashService;
}

export interface Utils {
  userFactory: AuthUserFactory;
  uuidGenerator: UuidGenerator;
  dbConnection: DbConnection;
}

export function createServices(appParams: AppParams): Services {
  const { userRepository, expenditureCategoryRepository } = createRepositories(appParams.dbConnection);
  const { userFactory, uuidGenerator } = createUtils(appParams);
  const hashService = new HashServiceImpl();

  return {
    hashService,
    userService: new UserServiceImpl({ userRepository, userFactory, hashService }),
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
