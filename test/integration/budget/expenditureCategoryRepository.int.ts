import {
  EXPENDITURE_CATEGORY_TABLE_NAME,
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
import { Guid } from '../../../src/core/guid';
import { expectEntity } from '../../common/util/expectUtil';

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
    await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).del();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new main category into db', async () => {
    // GIVEN
    const category = expenditureCategoryBuilder().withId(Guid.fromUuid('63e116d2-e429-444f-bae2-461fb9a7ce47')).withName('testName').valueOf();

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('id', '63e116d2-e429-444f-bae2-461fb9a7ce47').first();
    expect({ id: onDb.id, name: onDb.name }).toStrictEqual({ id: '63e116d2-e429-444f-bae2-461fb9a7ce47', name: 'testName' });
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new subcategories into db', async () => {
    // GIVEN
    const category = expenditureCategoryBuilder()
      .withSubcategories([
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('c868951a-bea5-4175-8a39-180f191b15fc')).withName('abc name').valueOf(),
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('562b10a8-0f84-4366-98d2-47ea47a1c504')).withName('def name').valueOf()
      ])
      .valueOf();

    // WHEN
    await expenditureCategoryRepository.save(category);

    // THEN
    const firstOnDb = await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('id', 'c868951a-bea5-4175-8a39-180f191b15fc').first();
    const secondOnDb = await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('id', '562b10a8-0f84-4366-98d2-47ea47a1c504').first();
    expect([
      { id: firstOnDb?.id, name: firstOnDb?.name },
      { id: secondOnDb?.id, name: secondOnDb?.name }
    ]).toStrictEqual([
      { id: 'c868951a-bea5-4175-8a39-180f191b15fc', name: 'abc name' },
      { id: '562b10a8-0f84-4366-98d2-47ea47a1c504', name: 'def name' }
    ]);
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing main category on db', async () => {
    // GIVEN
    let existingCategory = expenditureCategoryBuilder()
      .withId(Guid.fromUuid('4b28af67-d1c8-41a7-bd81-b20f7eaed3e5'))
      .withSubcategories([
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('c868951a-bea5-4175-8a39-180f191b15fc')).withName('abc name').valueOf(),
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('562b10a8-0f84-4366-98d2-47ea47a1c504')).withName('def name').valueOf()
      ])
      .valueOf();
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory = expenditureCategoryBuilder()
      .withId(Guid.fromUuid('4b28af67-d1c8-41a7-bd81-b20f7eaed3e5'))
      .withSubcategories([expenditureSubcategoryBuilder().withId(Guid.fromUuid('957b794c-3840-42e4-b91a-e7b311cde8ba')).withName('xyz name').valueOf()])
      .valueOf();

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = (await dbConnection.db(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('category_id', '4b28af67-d1c8-41a7-bd81-b20f7eaed3e5')).map(({ id, name, category_id }) => ({
      id,
      name,
      category_id
    }));
    expect(onDb).toStrictEqual([{ id: '957b794c-3840-42e4-b91a-e7b311cde8ba', name: 'xyz name', category_id: '4b28af67-d1c8-41a7-bd81-b20f7eaed3e5' }]);
  });

  it('GIVEN valid existing expenditure category WHEN save THEN update existing subcategories on db', async () => {
    // GIVEN
    const categoryUuid = '7257fd31-ed76-494d-bfab-2ba3d48713b0';
    const existingCategory = expenditureCategoryBuilder().withId(Guid.fromUuid(categoryUuid)).withName('oldName').valueOf();
    await expenditureCategoryRepository.save(existingCategory);
    existingCategory.changeName('updatedName');

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('id', categoryUuid).first();
    expect({ id: onDb.id, name: onDb.name }).toStrictEqual({ id: categoryUuid, name: 'updatedName' });
  });

  it('GIVEN valid not existing expenditure category WHEN save THEN insert new category with valid created and updated date', async () => {
    // GIVEN
    const categoryUuid = '7257fd31-ed76-494d-bfab-2ba3d48713b0';
    const created = dayjs.utc('2022-01-10 10:00:00');
    jest.spyOn(clock, 'now').mockReturnValue(created);
    const subcategories = [
      expenditureSubcategoryBuilder().withId(Guid.fromUuid('957b794c-3840-42e4-b91a-e7b311cde8ba')).withName('abc').valueOf(),
      expenditureSubcategoryBuilder().withId(Guid.fromUuid('4b28af67-d1c8-41a7-bd81-b20f7eaed3e5')).withName('def').valueOf()
    ];
    const mainCategory = expenditureCategoryBuilder().withId(Guid.fromUuid(categoryUuid)).withName('testName').withSubcategories(subcategories).valueOf();

    // WHEN
    await expenditureCategoryRepository.save(mainCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('id', categoryUuid).first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated: created });
  });

  it('GIVEN valid existing expenditure category WHEN save THEN change updated date category on db', async () => {
    // GIVEN
    const uuid = '0bf9b9be-0264-4663-8cf6-2c353c24715e';
    const created = dayjs.utc('2022-01-10 10:00:00');
    const updated = dayjs.utc('2022-01-20 10:00:00');
    const existingCategory = expenditureCategoryBuilder().withId(Guid.fromUuid(uuid)).withName('oldName').valueOf();
    jest.spyOn(clock, 'now').mockReturnValue(created);
    await expenditureCategoryRepository.save(existingCategory);
    jest.spyOn(clock, 'now').mockReturnValue(updated);

    // WHEN
    await expenditureCategoryRepository.save(existingCategory);

    // THEN
    const onDb = await dbConnection.db(EXPENDITURE_CATEGORY_TABLE_NAME).where('id', uuid).first();
    expect({ created: clock.fromDb(onDb.created), updated: clock.fromDb(onDb.updated) }).toStrictEqual({ created, updated });
  });

  it('GIVEN not existing category name WHEN findByName THEN return null', async () => {
    // GIVEN
    const nonExistingName = 'nonExistingName';

    // WHEN
    const result = await expenditureCategoryRepository.findByName(nonExistingName);

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing category name WHEN findByName THEN return null', async () => {
    // GIVEN
    const existingName = 'existingName';
    const existingCategory = expenditureCategoryBuilder()
      .withName(existingName)
      .withSubcategories([
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('c868951a-bea5-4175-8a39-180f191b15fc')).withName('abc name').valueOf(),
        expenditureSubcategoryBuilder().withId(Guid.fromUuid('562b10a8-0f84-4366-98d2-47ea47a1c504')).withName('def name').valueOf()
      ])
      .valueOf();
    await expenditureCategoryRepository.save(existingCategory);

    // WHEN
    const result = await expenditureCategoryRepository.findByName(existingName);

    // THEN
    expectEntity(result).toHaveEqualValue(existingCategory);
  });

  it('GIVEN not existing guid WHEN findById THEN return null', async () => {
    // GIVEN
    const nonExistingGuid: Guid = Guid.fromUuid('562b10a8-0f84-4366-98d2-47ea47a1c504');

    // WHEN
    const result = await expenditureCategoryRepository.findById(nonExistingGuid);

    // THEN
    expect(result).toBeNull();
  });

  it('GIVEN existing guid WHEN findById THEN return category', async () => {
    // GIVEN
    const category = expenditureCategoryBuilder().withId(Guid.fromUuid('c868951a-bea5-4175-8a39-180f191b15fc')).valueOf();
    await expenditureCategoryRepository.save(category);

    // WHEN
    const result = await expenditureCategoryRepository.findById(category.getId());

    // THEN
    expectEntity(result).toHaveEqualValue(category);
  });
});
