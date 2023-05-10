import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../../../../../src/budget/expenditure/category/expenditureCategoryService';
import { ExpenditureCategoryRepository } from '../../../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { uuidGenerator } from '../../../../../src/core/uuidGenerator';
import { expenditureCategoryBuilder } from '../../../../common/builder/expenditureSubcategoryBuilder';
import { Guid } from '../../../../../src/core/guid';

describe('ExpenditureCategoryService unit test', () => {
  let uuid: string;
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: ExpenditureCategoryService;

  beforeEach(() => {
    uuid = '7989fab3-7402-482a-a393-84ca96977850';
    jest.spyOn(uuidGenerator, 'generate').mockReturnValue(uuid);
    expenditureCategoryRepository = { findByName: jest.fn(), save: jest.fn() };
    addExpenditureCategory = new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid input WHEN add THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addExpenditureCategory.addCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withId(Guid.fromUuid(uuid)).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expect(expenditureCategoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN add THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addExpenditureCategory.addCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withId(Guid.fromUuid(uuid)).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expect(result).toStrictEqual(expected);
  });

  // same category name
  // add subcategory
});
