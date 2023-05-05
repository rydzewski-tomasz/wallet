import { UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactory, AuthUserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { createAccessTokenFactoryMock, createHashServiceMock } from '../../../common/mock/mocks';
import { expectEntity } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';
import { HashService } from '../../../../src/auth/user/hashService';
import { AccessTokenFactory } from '../../../../src/auth/user/accessTokenFactory';
import { uuidGenerator } from '../../../../src/core/uuidGenerator';

describe('AuthUserFactory unit test', () => {
  let userFactory: AuthUserFactory;
  let hashService: HashService;
  let accessTokenFactory: AccessTokenFactory;

  beforeEach(() => {
    hashService = createHashServiceMock();
    accessTokenFactory = createAccessTokenFactoryMock();

    userFactory = new AuthUserFactoryImpl({ hashService, accessTokenFactory });
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
