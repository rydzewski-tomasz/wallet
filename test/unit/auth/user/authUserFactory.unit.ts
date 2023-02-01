import { UserStatus } from '../../../../src/auth/user/authUser';
import { AuthUserFactory, UserFactoryImpl } from '../../../../src/auth/user/authUserFactory';
import { UuidGenerator } from '../../../../src/core/uuidGenerator';
import { createUuidGeneratorMock } from '../../../common/mock/mocks';
import { expectEntity } from '../../../common/util/expectUtil';
import { authUserBuilder } from '../../../common/builder/authUserBuilder';

describe('AuthUserFactory unit test', () => {
  let uuidGenerator: UuidGenerator;
  let userFactory: AuthUserFactory;

  beforeEach(() => {
    uuidGenerator = createUuidGeneratorMock();
    userFactory = new UserFactoryImpl(uuidGenerator);
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
