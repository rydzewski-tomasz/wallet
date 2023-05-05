import { AuthUserErrorType, UserStatus } from '../../../../src/auth/user/authUser';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { expectEntity, expectResult } from '../../../common/util/expectUtil';
import { OK } from '../../../../src/core/result';
import { AccessToken } from '../../../../src/auth/user/authToken';
import { hashService } from '../../../../src/auth/user/hashService';

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
    await user.signup({ username, password });

    // THEN
    const expected = authUserBuilder().withUsername(username).withStatus(UserStatus.Unverified).withPasswordHash(expect.any(String)).valueOf();
    expectEntity(user).toHaveEqualValue(expected);
  });

  it('GIVEN user without New status WHEN signup THEN throw error', async () => {
    // GIVEN
    const username = 'userLogin';
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const signup = async () => user.signup({ username, password });

    // THEN
    await expect(signup).rejects.toThrow(AuthUserErrorType.InvalidStatus);
  });

  it('GIVEN user without Active status WHEN login THEN throw InvalidStatus error', async () => {
    // GIVEN
    const password = 'test';
    const user = authUserBuilder().withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const login = async () => user.login({ password });

    // THEN
    await expect(login).rejects.toThrow(AuthUserErrorType.InvalidStatus);
  });

  it('GIVEN invalid password WHEN login THEN return InvalidPassword result', async () => {
    // GIVEN
    const password = 'invalid';
    const user = authUserBuilder().withStatus(UserStatus.Active).valueOf();

    // WHEN
    const result = await user.login({ password });

    // THEN
    expectResult(result).toBeError(AuthUserErrorType.InvalidPassword);
  });

  it('GIVEN valid password WHEN login THEN return success result', async () => {
    // GIVEN
    const password = 'test';
    const passwordHash = await hashService.generateHash(password);
    const user = authUserBuilder()
      // @ts-ignore
      .useCreateAccessToken(async () => {
        return {} as AccessToken;
      })
      .withStatus(UserStatus.Active)
      .withPasswordHash(passwordHash)
      .valueOf();

    // WHEN
    const result = await user.login({ password });

    // THEN
    expectResult(result).toBeSuccess(OK);
  });
});
