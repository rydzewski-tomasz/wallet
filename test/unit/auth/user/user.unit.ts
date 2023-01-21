import { UserErrorType, UserStatus } from '../../../../src/auth/user/user';
import bcrypt from 'bcryptjs';
import { userBuilder } from '../../../common/builder/userBuilder';
import { expectResult } from '../../../common/util/expectUtil';
import { OK } from '../../../../src/core/result';

describe('User unit tests', () => {
  it('GIVEN valid user WHEN remove THEN change user status to Deleted', async () => {
    // GIVEN
    const user = userBuilder().withStatus(UserStatus.Active).valueOf();

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
    const user = userBuilder().withStatus(UserStatus.New).valueOf();

    // WHEN
    await user.signup({ username, password });

    // THEN
    const snapshot = user.toSnapshot();
    expect({
      login: snapshot.username,
      isValidPassword: await bcrypt.compare('test', snapshot.passwordHash)
    }).toStrictEqual({
      login: 'userLogin',
      isValidPassword: true
    });
  });

  it('GIVEN user without New status WHEN signup THEN throw error', async () => {
    // GIVEN
    const username = 'userLogin';
    const password = 'test';
    const user = userBuilder().withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const signup = async () => user.signup({ username, password });

    // THEN
    await expect(signup).rejects.toThrow(UserErrorType.InvalidStatus);
  });

  it('GIVEN user without Active status WHEN login THEN throw InvalidStatus error', async () => {
    // GIVEN
    const password = 'test';
    const passwordHash = '$2a$10$Q1EbhfbnsV3uQIH25WHWQ.4EYBP6E.ZONROrN5J7PZpObwrSg/83O';
    const user = userBuilder().withPasswordHash(passwordHash).withStatus(UserStatus.Unverified).valueOf();

    // WHEN
    const login = async () => user.login({ password });

    // THEN
    await expect(login).rejects.toThrow(UserErrorType.InvalidStatus);
  });

  it('GIVEN invalid password WHEN login THEN return InvalidPassword result', async () => {
    // GIVEN
    const password = 'invalid';
    const passwordHash = '$2a$10$Q1EbhfbnsV3uQIH25WHWQ.4EYBP6E.ZONROrN5J7PZpObwrSg/83O';
    const user = userBuilder().withPasswordHash(passwordHash).withStatus(UserStatus.Active).valueOf();

    // WHEN
    const result = await user.login({ password });

    // THEN
    expectResult(result).toBeError(UserErrorType.InvalidPassword);
  });

  it('GIVEN valid password WHEN login THEN return success result', async () => {
    // GIVEN
    const password = 'test';
    const passwordHash = '$2a$10$Q1EbhfbnsV3uQIH25WHWQ.4EYBP6E.ZONROrN5J7PZpObwrSg/83O';
    const user = userBuilder().withPasswordHash(passwordHash).withStatus(UserStatus.Active).valueOf();

    // WHEN
    const result = await user.login({ password });

    // THEN
    expectResult(result).toBeSuccess(OK);
  });
});
