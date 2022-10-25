import { Entity, WithUuid } from '../../../src/core/entity';

class TestEntity extends Entity<WithUuid> {
  constructor(input: { uuid: string }) {
    super(input);
  }
}

describe('Entity unit test', () => {
  it('GIVEN different uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ uuid: 'firstUuid' });
    const secondEntity = new TestEntity({ uuid: 'secondUuid' });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeFalsy();
  });

  it('GIVEN same uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ uuid: 'testUuid' });
    const secondEntity = new TestEntity({ uuid: 'testUuid' });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeTruthy();
  });
});
