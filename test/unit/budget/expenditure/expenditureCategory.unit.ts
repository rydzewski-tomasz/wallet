import { expenditureSubcategoryBuilder } from '../../../common/builder/expenditureSubcategoryBuilder';
import { expectEntity } from '../../../common/util/expectUtil';

describe('ExpenditureSubcategory unit tests', () => {
  it('GIVEN expenditureCategory WHEN update name THEN update category name', async () => {
    // GIVEN
    const expenditureCategory = expenditureSubcategoryBuilder().withName('old category name').valueOf();

    // WHEN
    expenditureCategory.changeName('new category name');

    // THEN
    const expectedExpenditureCategory = expenditureSubcategoryBuilder(expenditureCategory.toSnapshot()).withName('new category name').valueOf();
    expectEntity(expectedExpenditureCategory).toHaveEqualValue(expenditureCategory);
  });
});
