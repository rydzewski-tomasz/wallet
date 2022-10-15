import { CATEGORY_TABLE_NAME, CategoryRepository, CategoryRepositoryImpl } from '../../src/category/categoryRepository';
import { Category } from '../../src/category/category';
import { DbTestSetup } from './dbTestSetup';
import { DbConnection } from '../../src/core/db/dbConnection';
import { initDbEnv } from '../common/setup/initDbEnv';

describe('categoryRepository integration test', () => {
  const { createConnection, closeConnection } = initDbEnv();
  let dbConnection: DbConnection;
  let categoryRepository: CategoryRepository;

  beforeAll(async () => {
    dbConnection = await createConnection();
    categoryRepository = new CategoryRepositoryImpl(dbConnection);
  });

  beforeEach(async () => {
    await dbConnection.db(CATEGORY_TABLE_NAME).del();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN valid not existing category WHEN save THEN insert new category into db', async () => {
    // GIVEN
    const category = new Category('testUuid', 'testName');

    // WHEN
    await categoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect(onDb).toStrictEqual({ uuid: 'testUuid', name: 'testName' });
  });

  it('GIVEN valid existing category WHEN save THEN update existing category on db', async () => {
    // GIVEN
    const existingCategory = new Category('testUuid', 'oldName');
    await categoryRepository.save(existingCategory);
    existingCategory.update({ name: 'updatedName' });

    // WHEN
    await categoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect(onDb).toStrictEqual({ uuid: 'testUuid', name: 'updatedName' });
  });
});
