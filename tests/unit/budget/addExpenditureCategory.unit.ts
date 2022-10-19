import { UuidGenerator } from '../../../src/core/uuidGenerator';
import { AddExpenditureCategory } from '../../../src/budget/expenditure/category/addExpenditureCategory';
import { ExpenditureCategory } from '../../../src/budget/expenditure/category/expenditureCategory';
import { ExpenditureCategoryRepository } from '../../../src/budget/expenditure/category/expenditureCategoryRepository';

describe('AddExpenditureCategory unit test', () => {
  let expenditureCategoryRepository: ExpenditureCategoryRepository;
  let addExpenditureCategory: AddExpenditureCategory;
  let uuid: string;

  beforeEach(() => {
    uuid = 'testUuid';
    const uuidGenerator: UuidGenerator = { generate: () => uuid };
    expenditureCategoryRepository = { save: jest.fn() };
    addExpenditureCategory = new AddExpenditureCategory(expenditureCategoryRepository, uuidGenerator)
  });

  it('GIVEN valid input WHEN addExpenditureCategory THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addExpenditureCategory.add('ExpenditureCategory Name');

    // THEN
    const expected: ExpenditureCategory = new ExpenditureCategory({ uuid, name: 'ExpenditureCategory Name' });
    expect(expenditureCategoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN addExpenditureCategory THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addExpenditureCategory.add('ExpenditureCategory Name');

    // THEN
    const expected: ExpenditureCategory = new ExpenditureCategory({ uuid, name: 'ExpenditureCategory Name' });
    expect(result).toStrictEqual(expected);
  });
});
