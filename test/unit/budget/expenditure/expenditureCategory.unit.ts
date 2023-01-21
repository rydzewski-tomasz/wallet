import { expenditureCategoryBuilder } from '../../../common/builder/expenditureCategoryBuilder';
import { expectEntity } from '../../../common/util/expectUtil';

describe('ExpenditureCategory unit tests', () => {
  it('GIVEN expenditureCategory WHEN update name THEN update category name', async () => {
    // GIVEN
    const expenditureCategory = expenditureCategoryBuilder().withName('old category name').valueOf();

    // WHEN
    expenditureCategory.update({ name: 'new category name' });

    // THEN
    const expectedExpenditureCategory = expenditureCategoryBuilder(expenditureCategory.toSnapshot()).withName('new category name').valueOf();
    expectEntity(expectedExpenditureCategory).toHaveEqualValue(expenditureCategory);
  });
});
