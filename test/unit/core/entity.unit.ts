import { Entity, WithUuid } from '../../../src/core/entity';
import { Uuid } from '../../../src/core/uuid';

class TestEntity extends Entity<WithUuid> {
  constructor(input: { uuid: Uuid }) {
    super(input);
  }
}

describe('Entity unit test', () => {
  it('GIVEN different uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ uuid: Uuid.create('firstUuid') });
    const secondEntity = new TestEntity({ uuid: Uuid.create('secondUuid') });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeFalsy();
  });

  it('GIVEN same uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ uuid: Uuid.create('testUuid') });
    const secondEntity = new TestEntity({ uuid: Uuid.create('testUuid') });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeTruthy();
  });
});
