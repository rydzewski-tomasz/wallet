import {
  ExpenditureCategoryErrorType,
  ExpenditureCategoryService,
  ExpenditureCategoryServiceImpl
} from '../../../../../src/budget/expenditure/category/expenditureCategoryService';
import { ExpenditureCategoryRepository } from '../../../../../src/budget/expenditure/category/expenditureCategoryRepository';
import { uuidGenerator } from '../../../../../src/core/uuidGenerator';
import { expenditureCategoryBuilder, expenditureSubcategoryBuilder } from '../../../../common/builder/expenditureSubcategoryBuilder';
import { Guid } from '../../../../../src/core/guid';
import { expectResultEntity } from '../../../../common/util/expectUtil';

describe('ExpenditureCategoryService.addCategory unit test', () => {
  let uuid: string;
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: ExpenditureCategoryService;

  beforeEach(() => {
    uuid = '7989fab3-7402-482a-a393-84ca96977850';
    jest.spyOn(uuidGenerator, 'generate').mockReturnValue(uuid);
    expenditureCategoryRepository = { findByName: jest.fn(), save: jest.fn(), findById: jest.fn() };
    addExpenditureCategory = new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository });
    jest.spyOn(expenditureCategoryRepository, 'findByName').mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN valid input WHEN addCategory THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addExpenditureCategory.addCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withId(Guid.fromUuid(uuid)).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expect(expenditureCategoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN addCategory THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addExpenditureCategory.addCategory('ExpenditureCategory Name');

    // THEN
    const expected = expenditureCategoryBuilder().withId(Guid.fromUuid(uuid)).withName('ExpenditureCategory Name').withSubcategories([]).valueOf();
    expectResultEntity(result).toBeSuccess(expected);
  });

  it('GIVEN duplicated category name WHEN addCategory THEN return error', async () => {
    // GIVEN
    const duplicatedCategoryName = 'duplicated name';
    jest.spyOn(expenditureCategoryRepository, 'findByName').mockResolvedValue(expenditureCategoryBuilder().valueOf());

    // WHEN
    const result = await addExpenditureCategory.addCategory(duplicatedCategoryName);

    // THEN
    expectResultEntity(result).toBeError(ExpenditureCategoryErrorType.CategoryAlreadyExists);
  });
});

describe('ExpenditureCategoryService.addSubcategory unit test', () => {
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: ExpenditureCategoryService;
  let categoryId: Guid;

  beforeEach(() => {
    categoryId = Guid.fromUuid('7989fab3-7402-482a-a393-84ca96977850');
    expenditureCategoryRepository = { findByName: jest.fn(), save: jest.fn(), findById: jest.fn() };
    addExpenditureCategory = new ExpenditureCategoryServiceImpl({ categoryRepository: expenditureCategoryRepository });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN not existing category WHEN addSubcategory THEN return error', async () => {
    // GIVEN
    const subcategoryName = 'new subcategory';
    jest.spyOn(expenditureCategoryRepository, 'findById').mockResolvedValue(null);

    // WHEN
    const result = await addExpenditureCategory.addSubcategory({ categoryId, subcategoryName });

    // THEN
    expectResultEntity(result).toBeError(ExpenditureCategoryErrorType.CategoryNotFound);
  });

  it('GIVEN duplicated subcategory name WHEN addSubcategory THEN return error', async () => {
    // GIVEN
    const subcategoryName = 'duplicated';
    const category = expenditureCategoryBuilder()
      .withSubcategories([expenditureSubcategoryBuilder().withName('duplicated').valueOf()])
      .valueOf();
    jest.spyOn(expenditureCategoryRepository, 'findById').mockResolvedValue(category);

    // WHEN
    const result = await addExpenditureCategory.addSubcategory({ categoryId, subcategoryName });

    // THEN
    expectResultEntity(result).toBeError(ExpenditureCategoryErrorType.SubcategoryAlreadyExists);
  });

  it('GIVEN valid subcategory name WHEN addSubcategory THEN return success', async () => {
    // GIVEN
    const subcategoryName = 'new subcategory';
    const category = expenditureCategoryBuilder()
      .withSubcategories([expenditureSubcategoryBuilder().withName('old subcategory').valueOf()])
      .valueOf();
    jest.spyOn(expenditureCategoryRepository, 'findById').mockResolvedValue(category);

    // WHEN
    const result = await addExpenditureCategory.addSubcategory({ categoryId, subcategoryName });

    // THEN
    expectResultEntity(result).toBeSuccess(category);
  });

  it('GIVEN valid subcategory name WHEN addSubcategory THEN save updated category on db', async () => {
    // GIVEN
    const subcategoryName = 'new subcategory';
    const category = expenditureCategoryBuilder()
      .withSubcategories([expenditureSubcategoryBuilder().withName('old subcategory').valueOf()])
      .valueOf();
    const newCategory = expenditureCategoryBuilder(category.toSnapshot())
      .withSubcategories([
        expenditureSubcategoryBuilder().withName('old subcategory').valueOf(),
        expenditureSubcategoryBuilder().withId(expect.anything()).withName(subcategoryName).valueOf()
      ])
      .valueOf();
    jest.spyOn(expenditureCategoryRepository, 'findById').mockResolvedValue(category);
    const saveSpy = jest.spyOn(expenditureCategoryRepository, 'save').mockResolvedValue(newCategory);

    // WHEN
    await addExpenditureCategory.addSubcategory({ categoryId, subcategoryName });

    // THEN
    expect(saveSpy).toBeCalledWith(newCategory);
  });
});
