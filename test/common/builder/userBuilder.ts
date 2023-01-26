import { User, UserProps, UserStatus, UserType } from '../../../src/auth/user/user';

export function sampleUserProps(): UserProps {
  return {
    uuid: 'testUuid',
    username: 'testLogin',
    passwordHash: 'aaaabbbbcccc',
    status: UserStatus.Active,
    type: UserType.User
  };
}

export const userBuilder = (props: UserProps = sampleUserProps()) => {
  return {
    withUuid: (uuid: UserProps['uuid']) => userBuilder({ ...props, uuid }),
    withUsername: (username: UserProps['username']) => userBuilder({ ...props, username }),
    withPasswordHash: (passwordHash: UserProps['passwordHash']) => userBuilder({ ...props, passwordHash }),
    withStatus: (status: UserProps['status']) => userBuilder({ ...props, status }),
    valueOf: () => new User(props)
  };
};
