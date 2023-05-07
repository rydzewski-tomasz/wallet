import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../../../../src/budget/expenditure/category/expenditureCategoryService';
import { ExpenditureCategoryRepository } from '../../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { uuidGenerator } from '../../../../src/core/uuidGenerator';
import { expenditureCategoryBuilder } from '../../../common/builder/expenditureSubcategoryBuilder';
import { Uuid } from '../../../../src/core/uuid';

describe('ExpenditureCategoryService unit test', () => {
  let uuid: Uuid;
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: ExpenditureCategoryService;

  beforeEach(() => {
    uuid = Uuid.create('testUuid');
    jest.spyOn(uuidGenerator, 'generate').mockReturnValue(uuid);
    expenditureCategoryRepository = { save: jest.fn() };
    addExpenditureCategory = new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid input WHEN add THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addExpenditureCategory.addMainCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withUuid(uuid).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expect(expenditureCategoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN add THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addExpenditureCategory.addMainCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withUuid(uuid).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expect(result).toStrictEqual(expected);
  });
});
