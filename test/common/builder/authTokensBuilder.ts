import { AccessToken, AccessTokenProps } from '../../../src/auth/user/authToken';

export function sampleAccessTokenProps(): AccessTokenProps {
  return {
    token: 'testAccessToken'
  };
}

export const accessTokenBuilder = (props: AccessTokenProps = sampleAccessTokenProps()) => {
  return {
    withToken: (token: AccessTokenProps['token']) => accessTokenBuilder({ ...props, token }),
    value: () => new AccessToken(props)
  };
};
