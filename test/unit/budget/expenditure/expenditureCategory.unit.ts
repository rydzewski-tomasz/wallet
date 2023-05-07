import { expenditureCategoryBuilder, expenditureSubcategoryBuilder } from '../../../common/builder/expenditureSubcategoryBuilder';
import { expectEntity } from '../../../common/util/expectUtil';
import { Uuid } from '../../../../src/core/uuid';

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
    expenditureCategory.addSubcategory(existingSubcategory);

    // THEN
    const expected = expenditureCategoryBuilder().withSubcategories([existingSubcategory]).valueOf();
    expectEntity(expenditureCategory).toHaveEqualValue(expected);
  });

  it('GIVEN expenditureCategory WHEN add existing subcategory THEN not add subcategory', async () => {
    // GIVEN
    const firstSubcategory = expenditureSubcategoryBuilder().withUuid(Uuid.create('1')).withName('1 subcategory').valueOf();
    const secondSubcategory = expenditureSubcategoryBuilder().withUuid(Uuid.create('2')).withName('2 subcategory').valueOf();
    const thirdSubcategory = expenditureSubcategoryBuilder().withUuid(Uuid.create('3')).withName('3 subcategory').valueOf();
    const expenditureCategory = expenditureCategoryBuilder().withSubcategories([firstSubcategory, secondSubcategory, thirdSubcategory]).valueOf();

    // WHEN
    expenditureCategory.removeSubcategory(firstSubcategory);

    // THEN
    const expected = expenditureCategoryBuilder().withSubcategories([secondSubcategory, thirdSubcategory]).valueOf();
    expectEntity(expenditureCategory).toHaveEqualValue(expected);
  });
});
