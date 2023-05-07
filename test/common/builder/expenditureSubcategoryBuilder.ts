import { ExpenditureSubcategory, ExpenditureSubcategoryProps } from '../../../src/budget/expenditure/category/expenditureSubcategory';
import { ExpenditureCategoryProps, ExpenditureCategory } from '../../../src/budget/expenditure/category/expenditureCategory';
import { Uuid } from '../../../src/core/uuid';

export function sampleExpenditureCategoryProps(): ExpenditureCategoryProps {
  return {
    name: 'test expenditure category',
    uuid: Uuid.create('categoryUuid'),
    subcategories: [expenditureSubcategoryBuilder().valueOf()]
  };
}

export const expenditureCategoryBuilder = (props: ExpenditureCategoryProps = sampleExpenditureCategoryProps()) => {
  return {
    withUuid: (uuid: ExpenditureCategoryProps['uuid']) => expenditureCategoryBuilder({ ...props, uuid }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureCategoryBuilder({ ...props, name }),
    withSubcategories: (subcategories: ExpenditureCategoryProps['subcategories']) => expenditureCategoryBuilder({ ...props, subcategories }),
    valueOf: () => new ExpenditureCategory(props)
  };
};

export function sampleExpenditureSubcategoryProps(): ExpenditureSubcategoryProps {
  return {
    name: 'test expenditure category',
    uuid: Uuid.create('subcategoryUuid')
  };
}

export const expenditureSubcategoryBuilder = (props: ExpenditureSubcategoryProps = sampleExpenditureSubcategoryProps()) => {
  return {
    withUuid: (uuid: ExpenditureCategoryProps['uuid']) => expenditureSubcategoryBuilder({ ...props, uuid }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureSubcategoryBuilder({ ...props, name }),
    valueOf: () => new ExpenditureSubcategory(props)
  };
};
