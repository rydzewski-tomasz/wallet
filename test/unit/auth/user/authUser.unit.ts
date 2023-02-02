import { AuthUserErrorType, UserStatus } from '../../../../src/auth/user/authUser';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { expectEntity, expectResult } from '../../../common/util/expectUtil';
import { OK } from '../../../../src/core/result';
import { AccessToken } from '../../../../src/auth/user/authToken';

describe('AuthUser unit tests', () => {
  it('GIVEN valid user WHEN remove THEN change user status to Deleted', async () => {
    // GIVEN
    const user = authUserBuilder().withStatus(UserStatus.Active).valueOf();

    // WHEN
    user.remove();

    // THEN
    const { status } = user.toSnapshot();
    expect(status).toStrictEqual(UserStatus.Deleted);
  });

  it('GIVEN valid user WHEN signup THEN add user login and passwordHash', async () => {
    // GIVEN
    const username = 'userLogin';
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.New).valueOf();

    // WHEN
    await user.signup({ username, password, generateHash: async () => 'testHash' });

    // THEN
    const expected = authUserBuilder().withUsername(username).withStatus(UserStatus.Unverified).withPasswordHash('testHash').valueOf();
    expectEntity(user).toHaveEqualValue(expected);
  });

  it('GIVEN user without New status WHEN signup THEN throw error', async () => {
    // GIVEN
    const username = 'userLogin';
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const signup = async () => user.signup({ username, password, generateHash: async () => 'test' });

    // THEN
    await expect(signup).rejects.toThrow(AuthUserErrorType.InvalidStatus);
  });

  it('GIVEN user without Active status WHEN login THEN throw InvalidStatus error', async () => {
    // GIVEN
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const login = async () => user.login({ password, checkHash: async () => true, createAccessToken: async () => new AccessToken({ token: 'testToken' }) });

    // THEN
    await expect(login).rejects.toThrow(AuthUserErrorType.InvalidStatus);
  });

  it('GIVEN invalid password WHEN login THEN return InvalidPassword result', async () => {
    // GIVEN
    const password = 'invalid';
    const user = authUserBuilder().withStatus(UserStatus.Active).valueOf();

    // WHEN
    const result = await user.login({ password, checkHash: async () => false, createAccessToken: async () => new AccessToken({ token: 'testToken' }) });

    // THEN
    expectResult(result).toBeError(AuthUserErrorType.InvalidPassword);
  });

  it('GIVEN valid password WHEN login THEN return success result', async () => {
    // GIVEN
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.Active).valueOf();

    // WHEN
    const result = await user.login({ password, checkHash: async () => true, createAccessToken: async () => new AccessToken({ token: 'testToken' }) });

    // THEN
    expectResult(result).toBeSuccess(OK);
  });
});
