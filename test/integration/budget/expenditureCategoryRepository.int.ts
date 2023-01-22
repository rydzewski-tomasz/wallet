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
    const category = new ExpenditureCategory({ uuid: 'testUuid', name: 'testName' });

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ uuid: onDb.uuid, name: onDb.name }).toStrictEqual({ uuid: 'testUuid', name: 'testName' });
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new category with valid created and updated date', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    jest.spyOn(clock, 'now').mockReturnValue(created);
    const category = new ExpenditureCategory({ uuid: 'testUuid', name: 'testName' });

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated: created });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing category on db', async () => {
    // GIVEN
    const existingCategory = new ExpenditureCategory({ uuid: 'testUuid', name: 'oldName' });
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory.changeName('updatedName');

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ uuid: onDb.uuid, name: onDb.name }).toStrictEqual({ uuid: 'testUuid', name: 'updatedName' });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN change updated date category on db', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    const updated = dayjs.utc('2022-01-20 10:00:00');
    const existingCategory = new ExpenditureCategory({ uuid: 'testUuid', name: 'oldName' });
    jest.spyOn(clock, 'now').mockReturnValue(created);
    await expenditureCategoryRepository.save(existingCategory);
    jest.spyOn(clock, 'now').mockReturnValue(updated);

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated });
  });
});
