import { Entity, WithId } from '../../../src/core/entity';
import { Guid } from '../../../src/core/guid';

class TestEntity extends Entity<WithId> {
  constructor(input: { id: Guid }) {
    super(input);
  }
}

describe('Entity unit test', () => {
  it('GIVEN different uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ id: Guid.fromUuid('5383112b-ac6c-4b94-b10d-e5eff5de449c') });
    const secondEntity = new TestEntity({ id: Guid.fromUuid('c9d62f4e-21a4-45d1-aa52-d64af6773cc9') });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeFalsy();
  });

  it('GIVEN same uids WHEN equals THEN return false', async () => {
    // GIVEN
    const firstEntity = new TestEntity({ id: Guid.fromUuid('3bac33e9-3bc2-4754-9ac1-9db2006e9be0') });
    const secondEntity = new TestEntity({ id: Guid.fromUuid('3bac33e9-3bc2-4754-9ac1-9db2006e9be0') });

    // WHEN
    const result = firstEntity.equals(secondEntity);

    // THEN
    expect(result).toBeTruthy();
  });
});
