import { AuthUserRepository, UserRepositoryImpl } from '../auth/user/authUserRepository';
import { ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../budget/expenditure/category/expenditureCategoryService';
import { AuthUserService, UserServiceImpl } from '../auth/user/authUserService';
import { AuthUserFactory, AuthUserFactoryImpl } from '../auth/user/authUserFactory';
import { AppParams } from '../app';
import { UuidGenerator } from './uuidGenerator';
import { DbConnection } from './db/dbConnection';
import { HashService, HashServiceImpl } from '../auth/user/hashService';
import { AccessTokenFactoryImpl } from '../auth/user/accessTokenFactory';

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
  const { userFactory, uuidGenerator } = createUtils(appParams);
  const { userRepository, expenditureCategoryRepository } = createRepositories({ dbConnection: appParams.dbConnection, userFactory });
  const hashService = new HashServiceImpl();

  return {
    hashService,
    userService: new UserServiceImpl({ userRepository, userFactory }),
    expenditureCategoryService: new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository, uuidGenerator })
  };
}

function createUtils({ dbConnection, config }: AppParams): Utils {
  const uuidGenerator = new UuidGenerator();
  const hashService = new HashServiceImpl();
  const accessTokenFactory = new AccessTokenFactoryImpl({ config });
  const userFactory = new AuthUserFactoryImpl({ uuidGenerator, hashService, accessTokenFactory });

  return {
    userFactory,
    uuidGenerator,
    dbConnection
  };
}

function createRepositories({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }): Repositories {
  return {
    userRepository: new UserRepositoryImpl({ dbConnection, userFactory }),
    expenditureCategoryRepository: new ExpenditureCategoryRepositoryImpl(dbConnection)
  };
}
