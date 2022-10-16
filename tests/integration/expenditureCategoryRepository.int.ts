import { EXPENDITURE_CATEGORY_TABLE_NAME, ExpenditureCategoryRepository, ExpenditureCategoryRepositoryImpl } from '../../src/budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategory } from '../../src/budget/expenditure/category/expenditureCategory';
import { DbTestSetup } from '../common/setup/dbTestSetup';
import { DbConnection } from '../../src/core/db/dbConnection';
import { initDbEnv } from '../common/setup/initDbEnv';

describe('addExpenditureCategoryRepository integration test', () => {
  const { createConnection, closeConnection } = initDbEnv();
  let dbConnection: DbConnection;
  let expenditureCategoryRepository: ExpenditureCategoryRepository;

  beforeAll(async () => {
    dbConnection = await createConnection();
    expenditureCategoryRepository = new ExpenditureCategoryRepositoryImpl(dbConnection);
  });

  afterEach(async () => {
    await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).del();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new category into db', async () => {
    // GIVEN
    const category = new ExpenditureCategory('testUuid', 'testName');

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect(onDb).toStrictEqual({ uuid: 'testUuid', name: 'testName' });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing category on db', async () => {
    // GIVEN
    const existingCategory = new ExpenditureCategory('testUuid', 'oldName');
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory.update({ name: 'updatedName' });

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect(onDb).toStrictEqual({ uuid: 'testUuid', name: 'updatedName' });
  });
});
