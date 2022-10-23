import { User, UserStatus } from '../../../src/user/user';
import bcrypt from 'bcryptjs';

describe('User unit test', () => {

  it('GIVEN valid user WHEN remove THEN change user status to Deleted', async () => {
    // GIVEN
    const user = new User({
      uuid: 'testUuid',
      login: 'testLogin',
      passwordHash: 'aaaa-bbbb-cccc-dddd',
      status: UserStatus.Active
    });

    // WHEN
    user.remove();

    // THEN
    const { status } = user.toSnapshot();
    expect(status).toStrictEqual(UserStatus.Deleted);
  });

  it('GIVEN valid user WHEN signup THEN add user login and passwordHash', async () => {
    // GIVEN
    const login = 'userLogin';
    const password = 'test';
    const user = new User({ uuid: 'testUuid', login: '', passwordHash: '', status: UserStatus.New });

    // WHEN
    await user.signup({ login, password });

    // THEN
    const snapshot = user.toSnapshot();
    expect({
      login: snapshot.login,
      isValidPassword: await bcrypt.compare('test', snapshot.passwordHash)
    }).toStrictEqual({
      login: 'userLogin',
      isValidPassword: true
    });
  });

  it('GIVEN user without New status WHEN signup THEN throw error', async () => {
    // GIVEN
    const login = 'userLogin';
    const password = 'test';
    const user = new User({ uuid: 'testUuid', login: '', passwordHash: '', status: UserStatus.Unverified });

    // WHEN
    const signup = async () => user.signup({ login, password });

    // THEN
    await expect(signup).rejects.toThrow('InvalidStatus');
  });

});
