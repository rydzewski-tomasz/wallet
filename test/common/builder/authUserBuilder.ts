import { AuthUser, AuthUserProps, UserStatus, UserType } from '../../../src/auth/user/authUser';

export function sampleUserProps(): AuthUserProps {
  return {
    uuid: 'testUuid',
    username: 'testLogin',
    passwordHash: 'aaaabbbbcccc',
    status: UserStatus.Active,
    type: UserType.User
  };
}

export const authUserBuilder = (props: AuthUserProps = sampleUserProps()) => {
  return {
    withUuid: (uuid: AuthUserProps['uuid']) => authUserBuilder({ ...props, uuid }),
    withUsername: (username: AuthUserProps['username']) => authUserBuilder({ ...props, username }),
    withPasswordHash: (passwordHash: AuthUserProps['passwordHash']) => authUserBuilder({ ...props, passwordHash }),
    withStatus: (status: AuthUserProps['status']) => authUserBuilder({ ...props, status }),
    valueOf: () => new AuthUser(props)
  };
};
