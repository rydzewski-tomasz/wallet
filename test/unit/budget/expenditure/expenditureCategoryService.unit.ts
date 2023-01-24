import { UuidGenerator } from '../../../../src/core/uuidGenerator';
import { ExpenditureCategoryService, ExpenditureCategoryServiceImpl } from '../../../../src/budget/expenditure/category/expenditureCategoryService';
import { ExpenditureCategoryRepository } from '../../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { expenditureMainCategoryBuilder } from '../../../common/builder/expenditureSubcategoryBuilder';

describe('ExpenditureCategoryService unit test', () => {
  let uuid: string;
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: ExpenditureCategoryService;

  beforeEach(() => {
    uuid = 'testUuid';
    const uuidGenerator: UuidGenerator = { generate: () => uuid };
    expenditureCategoryRepository = { save: jest.fn() };
    addExpenditureCategory = new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository, uuidGenerator });
  });

  it('GIVEN valid input WHEN add THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addExpenditureCategory.addMainCategory('ExpenditureMainCategory Name');

    // THEN
    const expected = expenditureMainCategoryBuilder().withUuid(uuid).withName('ExpenditureMainCategory Name').withSubcategories([]).valueOf();
    expect(expenditureCategoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN add THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addExpenditureCategory.addMainCategory('ExpenditureMainCategory Name');

    // THEN
    const expected = expenditureMainCategoryBuilder().withUuid(uuid).withName('ExpenditureMainCategory Name').withSubcategories([]).valueOf();
    expect(result).toStrictEqual(expected);
  });
});
