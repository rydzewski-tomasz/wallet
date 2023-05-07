import {
  EXPENDITURE_MAIN_CATEGORY_TABLE_NAME,
  EXPENDITURE_SUBCATEGORY_TABLE_NAME,
  ExpenditureCategoryRepository,
  ExpenditureCategoryRepositoryImpl
} from '../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { DbConnection } from '../../../src/core/db/dbConnection';
import { initDbEnv } from '../../common/setup/initDbEnv';
import clock from '../../../src/core/clock';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { expenditureCategoryBuilder, expenditureSubcategoryBuilder } from '../../common/builder/expenditureSubcategoryBuilder';
import { Uuid } from '../../../src/core/uuid';

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
    await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).del();
    await dbConnection.db(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME).del();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new main category into db', async () => {
    // GIVEN
    const category = expenditureCategoryBuilder().withUuid(Uuid.create('testUuid')).withName('testName').valueOf();

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ uuid: onDb.uuid, name: onDb.name }).toStrictEqual({ uuid: 'testUuid', name: 'testName' });
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new subcategories into db', async () => {
    // GIVEN
    const category = expenditureCategoryBuilder()
      .withSubcategories([
        expenditureSubcategoryBuilder().withUuid(Uuid.create('uid123')).withName('abc name').valueOf(),
        expenditureSubcategoryBuilder().withUuid(Uuid.create('uid456')).withName('def name').valueOf()
      ])
      .valueOf();

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const firstOnDb = await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('uuid', 'uid123').first();
    const secondOnDb = await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('uuid', 'uid456').first();
    expect([
      { uuid: firstOnDb?.uuid, name: firstOnDb?.name },
      { uuid: secondOnDb?.uuid, name: secondOnDb?.name }
    ]).toStrictEqual([
      { uuid: 'uid123', name: 'abc name' },
      { uuid: 'uid456', name: 'def name' }
    ]);
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing main category on db', async () => {
    // GIVEN
    let existingCategory = expenditureCategoryBuilder()
      .withUuid(Uuid.create('mainUid'))
      .withSubcategories([
        expenditureSubcategoryBuilder().withUuid(Uuid.create('uid123')).withName('abc name').valueOf(),
        expenditureSubcategoryBuilder().withUuid(Uuid.create('uid456')).withName('def name').valueOf()
      ])
      .valueOf();
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory = expenditureCategoryBuilder()
      .withUuid(Uuid.create('mainUid'))
      .withSubcategories([expenditureSubcategoryBuilder().withUuid(Uuid.create('uid987')).withName('xyz name').valueOf()])
      .valueOf();

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = (await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('category_uuid', 'mainUid')).map(({ uuid, name, category_uuid }) => ({
      uuid,
      name,
      category_uuid
    }));
    expect(onDb).toStrictEqual([{ uuid: 'uid987', name: 'xyz name', category_uuid: 'mainUid' }]);
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing subcategories on db', async () => {
    // GIVEN
    const existingCategory = expenditureCategoryBuilder().withUuid(Uuid.create('testUuid')).withName('oldName').valueOf();
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory.changeName('updatedName');

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ uuid: onDb.uuid, name: onDb.name }).toStrictEqual({ uuid: 'testUuid', name: 'updatedName' });
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new category with valid created and updated date', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    jest.spyOn(clock, 'now').mockReturnValue(created);
    const subcategories = [
      expenditureSubcategoryBuilder().withUuid(Uuid.create('abc123')).withName('abc').valueOf(),
      expenditureSubcategoryBuilder().withUuid(Uuid.create('def456')).withName('def').valueOf()
    ];
    const mainCategory = expenditureCategoryBuilder().withUuid(Uuid.create('testUuid')).withName('testName').withSubcategories(subcategories).valueOf();

    // WHEN
    await expenditureCategoryRepository.save(mainCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated: created });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN change updated date category on db', async () => {
    // GIVEN
    const created = dayjs.utc('2022-01-10 10:00:00');
    const updated = dayjs.utc('2022-01-20 10:00:00');
    const existingCategory = expenditureCategoryBuilder().withUuid(Uuid.create('testUuid')).withName('oldName').valueOf();
    jest.spyOn(clock, 'now').mockReturnValue(created);
    await expenditureCategoryRepository.save(existingCategory);
    jest.spyOn(clock, 'now').mockReturnValue(updated);

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME).where('uuid', 'testUuid').first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated });
  });
});
