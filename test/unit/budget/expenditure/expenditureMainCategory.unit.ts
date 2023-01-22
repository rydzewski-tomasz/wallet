import { expenditureCategoryBuilder, expenditureMainCategoryBuilder } from '../../../common/builder/expenditureCategoryBuilder';
import { expectEntity } from '../../../common/util/expectUtil';

describe('ExpenditureMainCategory unit test', () => {
  it('GIVEN expenditureMainCategory WHEN update name THEN update category name', async () => {
    // GIVEN
    const expenditureMainCategory = expenditureMainCategoryBuilder().withName('old category name').valueOf();

    // WHEN
    expenditureMainCategory.changeName('new category name');

    // THEN
    const expectedExpenditureCategory = expenditureMainCategoryBuilder(expenditureMainCategory.toSnapshot()).withName('new category name').valueOf();
    expectEntity(expectedExpenditureCategory).toHaveEqualValue(expenditureMainCategory);
  });

  it('GIVEN expenditureMainCategory WHEN add new subcategory THEN add category to main subcategories', async () => {
    // GIVEN
    const expenditureMainCategory = expenditureMainCategoryBuilder().withSubcategories([]).valueOf();
    const categoryToAdd = expenditureCategoryBuilder().withName('to add').valueOf();

    // WHEN
    expenditureMainCategory.addSubcategory(categoryToAdd);

    // THEN
    const expected = expenditureMainCategoryBuilder().withSubcategories([categoryToAdd]).valueOf();
    expectEntity(expenditureMainCategory).toHaveEqualValue(expected);
  });

  it('GIVEN expenditureMainCategory WHEN add existing subcategory THEN not add subcategory', async () => {
    // GIVEN
    const existingSubcategory = expenditureCategoryBuilder().withName('existing subcategory').valueOf();
    const expenditureMainCategory = expenditureMainCategoryBuilder().withSubcategories([existingSubcategory]).valueOf();

    // WHEN
    expenditureMainCategory.addSubcategory(existingSubcategory);

    // THEN
    const expected = expenditureMainCategoryBuilder().withSubcategories([existingSubcategory]).valueOf();
    expectEntity(expenditureMainCategory).toHaveEqualValue(expected);
  });

  it('GIVEN expenditureMainCategory WHEN add existing subcategory THEN not add subcategory', async () => {
    // GIVEN
    const firstSubcategory = expenditureCategoryBuilder().withUuid('1').withName('1 subcategory').valueOf();
    const secondSubcategory = expenditureCategoryBuilder().withUuid('2').withName('2 subcategory').valueOf();
    const thirdSubcategory = expenditureCategoryBuilder().withUuid('3').withName('3 subcategory').valueOf();
    const expenditureMainCategory = expenditureMainCategoryBuilder().withSubcategories([firstSubcategory, secondSubcategory, thirdSubcategory]).valueOf();

    // WHEN
    expenditureMainCategory.removeSubcategory(firstSubcategory);

    // THEN
    const expected = expenditureMainCategoryBuilder().withSubcategories([secondSubcategory, thirdSubcategory]).valueOf();
    expectEntity(expenditureMainCategory).toHaveEqualValue(expected);
  });
});
