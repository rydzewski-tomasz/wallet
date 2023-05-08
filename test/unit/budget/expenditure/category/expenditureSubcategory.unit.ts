import { expenditureSubcategoryBuilder } from '../../../../common/builder/expenditureSubcategoryBuilder';
import { expectEntity } from '../../../../common/util/expectUtil';

describe('ExpenditureSubcategory unit tests', () => {
  it('GIVEN expenditureSubcategory WHEN update name THEN update category name', async () => {
    // GIVEN
    const expenditureSubcategory = expenditureSubcategoryBuilder().withName('old category name').valueOf();

    // WHEN
    expenditureSubcategory.changeName('new category name');

    // THEN
    const expected = expenditureSubcategoryBuilder(expenditureSubcategory.toSnapshot()).withName('new category name').valueOf();
    expectEntity(expenditureSubcategory).toHaveEqualValue(expected);
  });
});
