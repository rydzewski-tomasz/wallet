import { AuthUserActions, AuthUserProps, UserStatus, UserType } from '../../../src/auth/user/authUser';
import { AuthUserFactoryImpl } from '../../../src/auth/user/authUserFactory';
import { AccessTokenFactoryImpl } from '../../../src/auth/user/accessTokenFactory';
import testConfig from '../config/testConfig';
import { Uuid } from '../../../src/core/uuid';

const authUserFactory = new AuthUserFactoryImpl({
  accessTokenFactory: new AccessTokenFactoryImpl({ config: testConfig.getAppConfig() })
});

export function sampleUserProps(): AuthUserProps {
  return {
    uuid: Uuid.create('testUuid'),
    username: 'testLogin',
    passwordHash: 'aaaabbbbcccc',
    status: UserStatus.Active,
    type: UserType.User
  };
}

export function sampleUserActions(): AuthUserActions {
  return authUserFactory.createActions();
}

export const authUserBuilder = (input?: { props?: AuthUserProps; actions?: AuthUserActions }) => {
  const props = input?.props || sampleUserProps();
  const actions = input?.actions || sampleUserActions();

  return {
    withUuid: (uuid: AuthUserProps['uuid']) => authUserBuilder({ props: { ...props, uuid }, actions }),
    withUsername: (username: AuthUserProps['username']) => authUserBuilder({ props: { ...props, username }, actions }),
    withAccessToken: (accessToken: AuthUserProps['accessToken']) => authUserBuilder({ props: { ...props, accessToken }, actions }),
    withPasswordHash: (passwordHash: AuthUserProps['passwordHash']) => authUserBuilder({ props: { ...props, passwordHash }, actions }),
    withStatus: (status: AuthUserProps['status']) => authUserBuilder({ props: { ...props, status }, actions }),
    useCreateAccessToken: (createAccessToken: AuthUserActions['createAccessToken']) => authUserBuilder({ props, actions: { ...actions, createAccessToken } }),
    valueOf: () => authUserFactory.create({ props, actions })
  };
};
