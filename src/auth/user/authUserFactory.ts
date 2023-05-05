import { UuidGenerator } from '../../core/uuidGenerator';
import { AuthUser, AuthUserActions, AuthUserProps, UserStatus, UserType } from './authUser';
import { HashService } from './hashService';
import { AccessTokenFactory } from './accessTokenFactory';

export interface AuthUserFactory {
  create: (input?: { props?: AuthUserProps; actions?: AuthUserActions }) => AuthUser;
  createProps: () => AuthUserProps;
  createActions: () => AuthUserActions;
}

export class AuthUserFactoryImpl implements AuthUserFactory {
  private readonly uuidGenerator: UuidGenerator;
  private readonly hashService: HashService;
  private readonly accessTokenFactory: AccessTokenFactory;

  constructor({ uuidGenerator, accessTokenFactory, hashService }: { uuidGenerator: UuidGenerator; hashService: HashService; accessTokenFactory: AccessTokenFactory }) {
    this.uuidGenerator = uuidGenerator;
    this.hashService = hashService;
    this.accessTokenFactory = accessTokenFactory;
  }

  create(input?: { props?: AuthUserProps; actions?: AuthUserActions }): AuthUser {
    const props = input?.props || this.createProps();
    const actions = input?.actions || this.createActions();
    return new AuthUser(props, actions);
  }

  createProps(): AuthUserProps {
    const uuid = this.uuidGenerator.generate();
    return { uuid, username: '', passwordHash: '', status: UserStatus.New, type: UserType.User };
  }

  createActions(): AuthUserActions {
    return {
      checkHash: this.hashService.checkHash.bind(this),
      generateHash: this.hashService.generateHash.bind(this.hashService),
      createAccessToken: this.accessTokenFactory.create.bind(this.accessTokenFactory)
    };
  }
}
