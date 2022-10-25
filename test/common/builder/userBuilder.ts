import { User, UserProps, UserStatus } from '../../../src/user/user';

export function sampleUserProps(): UserProps {
  return {
    uuid: 'testUuid',
    login: 'testLogin',
    passwordHash: 'aaaabbbbcccc',
    status: UserStatus.Active
  };
}

export const userBuilder = (props: UserProps = sampleUserProps()) => {
  return {
    withUuid: (uuid: UserProps['uuid']) => userBuilder({ ...props, uuid }),
    withLogin: (login: UserProps['login']) => userBuilder({ ...props, login }),
    withPasswordHash: (passwordHash: UserProps['passwordHash']) => userBuilder({ ...props, passwordHash }),
    withStatus: (status: UserProps['status']) => userBuilder({ ...props, status }),
    toProps: () => props,
    valueOf: () => new User(props)
  };
};
