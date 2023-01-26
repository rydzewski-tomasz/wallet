import { UserStatus } from '../../../../src/auth/user/user';
import { UserFactory, UserFactoryImpl } from '../../../../src/auth/user/userFactory';
import { UuidGenerator } from '../../../../src/core/uuidGenerator';
import { createUuidGeneratorMock } from '../../../common/mock/mocks';
import { expectEntity } from '../../../common/util/expectUtil';
import { userBuilder } from '../../../common/builder/userBuilder';

describe('UserFactory unit test', () => {
  let uuidGenerator: UuidGenerator;
  let userFactory: UserFactory;

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
    const expected = userBuilder().withUuid('testUuid').withUsername('').withPasswordHash('').withStatus(UserStatus.New).valueOf();
    expectEntity(user).toHaveEqualValue(expected);
  });
});
