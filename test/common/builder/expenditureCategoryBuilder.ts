import { ExpenditureCategory, ExpenditureCategoryProps } from '../../../src/budget/expenditure/category/expenditureCategory';

export function sampleExpenditureCategoryProps(): ExpenditureCategoryProps {
  return {
    name: 'test expenditure category',
    uuid: 'testExpenditureCategoryUuid'
  };
}

export const expenditureCategoryBuilder = (props: ExpenditureCategoryProps = sampleExpenditureCategoryProps()) => {
  return {
    withUuid: (uuid: ExpenditureCategoryProps['uuid']) => expenditureCategoryBuilder({ ...props, uuid }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureCategoryBuilder({ ...props, name }),
    valueOf: () => new ExpenditureCategory(props)
  };
};
