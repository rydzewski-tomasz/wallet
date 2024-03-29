import { expenditureCategoryBuilder, expenditureSubcategoryBuilder } from '../../../../common/builder/expenditureSubcategoryBuilder';
import { expectEntity } from '../../../../common/util/expectUtil';
import { Guid } from '../../../../../src/core/guid';

describe('ExpenditureCategory unit test', () => {
  it('GIVEN expenditureCategory WHEN update name THEN update category name', async () => {
    // GIVEN
    const expenditureCategory = expenditureCategoryBuilder().withName('old category name').valueOf();

    // WHEN
    expenditureCategory.changeName('new category name');

    // THEN
    const expectedExpenditureCategory = expenditureCategoryBuilder(expenditureCategory.toSnapshot()).withName('new category name').valueOf();
    expectEntity(expenditureCategory).toHaveEqualValue(expectedExpenditureCategory);
  });

  it('GIVEN expenditureCategory WHEN add new subcategory THEN add category to main subcategories', async () => {
    // GIVEN
    const expenditureCategory = expenditureCategoryBuilder().withSubcategories([]).valueOf();
    const categoryToAdd = expenditureSubcategoryBuilder().withName('to add').valueOf();

    // WHEN
    expenditureCategory.addSubcategory(categoryToAdd);

    // THEN
    const expected = expenditureCategoryBuilder().withSubcategories([categoryToAdd]).valueOf();
    expectEntity(expenditureCategory).toHaveEqualValue(expected);
  });

  it('GIVEN expenditureCategory WHEN add existing subcategory THEN not add subcategory', async () => {
    // GIVEN
    const existingSubcategory = expenditureSubcategoryBuilder().withName('existing subcategory').valueOf();
    const expenditureCategory = expenditureCategoryBuilder().withSubcategories([existingSubcategory]).valueOf();

    // WHEN
    const test = () => expenditureCategory.addSubcategory(existingSubcategory);

    // THEN
    expect(test).toThrowError('SubcategoryAlreadyExists');
  });

  it('GIVEN expenditureCategory WHEN add existing subcategory THEN not add subcategory', async () => {
    // GIVEN
    const firstSubcategory = expenditureSubcategoryBuilder().withId(Guid.fromUuid('93d9e8f2-37e0-4bdf-8820-7da50a075341')).withName('1 subcategory').valueOf();
    const secondSubcategory = expenditureSubcategoryBuilder().withId(Guid.fromUuid('eddc326b-ab0c-4227-8bf2-8f2456117288')).withName('2 subcategory').valueOf();
    const thirdSubcategory = expenditureSubcategoryBuilder().withId(Guid.fromUuid('2168c683-0cb9-4751-aaa1-de8e335ae284')).withName('3 subcategory').valueOf();
    const expenditureCategory = expenditureCategoryBuilder().withSubcategories([firstSubcategory, secondSubcategory, thirdSubcategory]).valueOf();

    // WHEN
    expenditureCategory.removeSubcategory(firstSubcategory);

    // THEN
    const expected = expenditureCategoryBuilder().withSubcategories([secondSubcategory, thirdSubcategory]).valueOf();
    expectEntity(expenditureCategory).toHaveEqualValue(expected);
  });
});
