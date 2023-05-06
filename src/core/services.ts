import { AuthUserRepository, UserRepositoryImpl } from '../auth/user/authUserRepository';
import { ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../budget/expenditure/category/expenditureCategoryService';
import { AuthUserService, AuthUserServiceImpl } from '../auth/user/authUserService';
import { AuthUserFactory, AuthUserFactoryImpl } from '../auth/user/authUserFactory';
import { AppParams } from '../app';
import { DbConnection } from './db/dbConnection';
import { AccessTokenFactoryImpl } from '../auth/user/accessTokenFactory';

export interface Repositories {
  userRepository: AuthUserRepository;
  expenditureCategoryRepository: ExpenditureCategoryRepository;
}

export interface Services {
  userService: AuthUserService;
  expenditureCategoryService: ExpenditureCategoryService;
}

export interface Factories {
  userFactory: AuthUserFactory;
  dbConnection: DbConnection;
}

export function createServices(appParams: AppParams): Services {
  const { userFactory } = createFactories(appParams);
  const { userRepository, expenditureCategoryRepository } = createRepositories({ dbConnection: appParams.dbConnection, userFactory });

  return {
    userService: new AuthUserServiceImpl({ userRepository, userFactory }),
    expenditureCategoryService: new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository })
  };
}

function createFactories({ dbConnection, config }: AppParams): Factories {
  const accessTokenFactory = new AccessTokenFactoryImpl({ config });
  const userFactory = new AuthUserFactoryImpl({ accessTokenFactory });

  return {
    userFactory,
    dbConnection
  };
}

function createRepositories({ dbConnection, userFactory }: { dbConnection: DbConnection; userFactory: AuthUserFactory }): Repositories {
  return {
    userRepository: new UserRepositoryImpl({ dbConnection, userFactory }),
    expenditureCategoryRepository: new ExpenditureCategoryRepositoryImpl(dbConnection)
  };
}
