import { UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactory, AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { createAccessTokenFactoryMock } from '../../../common/mock/mocks';
import { expectEntity } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { AccessTokenFactory } from '../../../../src/auth/user/accessTokenFactory';
import { uuidGenerator } from '../../../../src/core/uuidGenerator';

describe('AuthUserFactory unit test', () => {
  let userFactory: AuthUserFactory;
  let accessTokenFactory: AccessTokenFactory;

  beforeEach(() => {
    accessTokenFactory = createAccessTokenFactoryMock();

    userFactory = new AuthUserFactoryImpl({ accessTokenFactory });
  });

  it('GIVEN uuid WHEN newUser THEN return user with uuid', async () => {
    // GIVEN
    jest.spyOn(uuidGenerator, 'generate').mockReturnValue('testUuid');

    // WHEN
    const user = userFactory.create();

    // THEN
    const expected = authUserBuilder().withUuid('testUuid').withUsername('').withPasswordHash('').withStatus(UserStatus.New).valueOf();
    expectEntity(user).toHaveEqualValue(expected);
  });
});
