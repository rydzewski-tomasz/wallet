import { AuthUserActions, AuthUserProps, UserStatus, UserType } from '../../../src/auth/user/authUser';
import { AuthUserFactoryImpl } from '../../../src/auth/user/authUserFactory';
import { UuidGenerator } from '../../../src/core/uuidGenerator';
import { HashServiceImpl } from '../../../src/auth/user/hashService';
import { AccessTokenFactoryImpl } from '../../../src/auth/user/accessTokenFactory';

const authUserFactory = new AuthUserFactoryImpl({
  uuidGenerator: new UuidGenerator(),
  hashService: new HashServiceImpl(),
  accessTokenFactory: new AccessTokenFactoryImpl()
});

export function sampleUserProps(): AuthUserProps {
  return {
    uuid: 'testUuid',
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
    useGenerateHash: (generateHash: AuthUserActions['generateHash']) => authUserBuilder({ props, actions: { ...actions, generateHash } }),
    useCheckHash: (checkHash: AuthUserActions['checkHash']) => authUserBuilder({ props, actions: { ...actions, checkHash } }),
    useCreateAccessToken: (createAccessToken: AuthUserActions['createAccessToken']) => authUserBuilder({ props, actions: { ...actions, createAccessToken } }),
    valueOf: () => authUserFactory.create({ props, actions })
  };
};
