import { ExpenditureCategory, ExpenditureCategoryProps } from '../../../src/budget/expenditure/category/expenditureCategory';
import { ExpenditureMainCategory, ExpenditureMainCategoryProps } from '../../../src/budget/expenditure/category/expenditureMainCategory';

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

export function sampleExpenditureMainCategoryProps(): ExpenditureMainCategoryProps {
  return {
    name: 'test expenditure category',
    uuid: 'testExpenditureCategoryUuid',
    subcategories: [expenditureCategoryBuilder().valueOf()]
  };
}

export const expenditureMainCategoryBuilder = (props: ExpenditureMainCategoryProps = sampleExpenditureMainCategoryProps()) => {
  return {
    withUuid: (uuid: ExpenditureMainCategoryProps['uuid']) => expenditureMainCategoryBuilder({ ...props, uuid }),
    withName: (name: ExpenditureMainCategoryProps['name']) => expenditureMainCategoryBuilder({ ...props, name }),
    withSubcategories: (subcategories: ExpenditureMainCategoryProps['subcategories']) => expenditureMainCategoryBuilder({ ...props, subcategories }),
    valueOf: () => new ExpenditureMainCategory(props)
  };
};
