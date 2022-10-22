import { UserStatus } from '../../../src/user/user';
import { UserFactory, UserFactoryImpl } from '../../../src/user/userFactory';
import { UuidGenerator } from '../../../src/core/uuidGenerator';
import { createUuidGeneratorMock } from '../../common/mock/mocks';

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
    const snapshot = user.toSnapshot();
    expect(snapshot).toStrictEqual({ uuid: 'testUuid', login: '', passwordHash: '', status: UserStatus.New });
  });
});