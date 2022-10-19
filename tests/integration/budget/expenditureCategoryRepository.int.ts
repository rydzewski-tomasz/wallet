import {
  EXPENDITURE_CATEGORY_TABLE_NAME,
  ExpenditureCategoryRepository,
  ExpenditureCategoryRepositoryImpl
} from '../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { ExpenditureCategory } from '../../../src/budget/expenditure/category/expenditureCategory';
import { DbConnection } from '../../../src/core/db/dbConnection';
import { initDbEnv } from '../../common/setup/initDbEnv';
import clock from '../../../src/core/clock';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new category into db', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    jest.spyOn(clock, 'now').mockReturnValue(created);
    const category = new ExpenditureCategory('testUuid', 'testName');

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ ...onDb, created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) })
      .toStrictEqual({ uuid: 'testUuid', name: 'testName', created, updated: created });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing category on db', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    const updated = dayjs.utc('2022-01-20 10:00:00');
    const existingCategory = new ExpenditureCategory('testUuid', 'oldName');
    jest.spyOn(clock, 'now').mockReturnValue(created);
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory.update({ name: 'updatedName' });
    jest.spyOn(clock, 'now').mockReturnValue(updated);

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ ...onDb, created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) })
      .toStrictEqual({ uuid: 'testUuid', name: 'updatedName', created, updated });
  });
});
