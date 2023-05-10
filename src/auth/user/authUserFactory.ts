import { AuthUser, AuthUserActions, AuthUserProps, UserStatus, UserType } from './authUser';
import { AccessTokenFactory } from './accessTokenFactory';
import { Guid } from '../../core/guid';

export interface AuthUserFactory {
  create: (input?: { props?: AuthUserProps; actions?: AuthUserActions }) => AuthUser;
  createProps: () => AuthUserProps;
  createActions: () => AuthUserActions;
}

export class AuthUserFactoryImpl implements AuthUserFactory {
  private readonly accessTokenFactory: AccessTokenFactory;

  constructor({ accessTokenFactory }: { accessTokenFactory: AccessTokenFactory }) {
    this.accessTokenFactory = accessTokenFactory;
  }

  create(input?: { props?: AuthUserProps; actions?: AuthUserActions }): AuthUser {
    const props = input?.props || this.createProps();
    const actions = input?.actions || this.createActions();
    return new AuthUser(props, actions);
  }

  createProps(): AuthUserProps {
    const id = Guid.create();
    return { id, username: '', passwordHash: '', status: UserStatus.New, type: UserType.User };
  }

  createActions(): AuthUserActions {
    return {
      createAccessToken: payload => this.accessTokenFactory.create(payload)
    };
  }
}
