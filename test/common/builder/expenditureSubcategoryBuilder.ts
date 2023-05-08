import { ExpenditureSubcategory, ExpenditureSubcategoryProps } from '../../../src/budget/expenditure/category/expenditureSubcategory';
import { ExpenditureCategoryProps, ExpenditureCategory } from '../../../src/budget/expenditure/category/expenditureCategory';
import { Guid } from '../../../src/core/guid';

export function sampleExpenditureCategoryProps(): ExpenditureCategoryProps {
  return {
    name: 'test expenditure category',
    id: Guid.fromUuid('3cccb301-4691-43b6-9167-a4a84d262e39'),
    subcategories: [expenditureSubcategoryBuilder().valueOf()]
  };
}

export const expenditureCategoryBuilder = (props: ExpenditureCategoryProps = sampleExpenditureCategoryProps()) => {
  return {
    withId: (id: ExpenditureCategoryProps['id']) => expenditureCategoryBuilder({ ...props, id }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureCategoryBuilder({ ...props, name }),
    withSubcategories: (subcategories: ExpenditureCategoryProps['subcategories']) => expenditureCategoryBuilder({ ...props, subcategories }),
    valueOf: () => new ExpenditureCategory(props)
  };
};

export function sampleExpenditureSubcategoryProps(): ExpenditureSubcategoryProps {
  return {
    id: Guid.fromUuid('63e116d2-e429-444f-bae2-461fb9a7ce47'),
    name: 'test expenditure category'
  };
}

export const expenditureSubcategoryBuilder = (props: ExpenditureSubcategoryProps = sampleExpenditureSubcategoryProps()) => {
  return {
    withId: (id: ExpenditureCategoryProps['id']) => expenditureSubcategoryBuilder({ ...props, id }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureSubcategoryBuilder({ ...props, name }),
    valueOf: () => new ExpenditureSubcategory(props)
  };
};
