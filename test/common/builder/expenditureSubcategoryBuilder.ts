import { ExpenditureSubcategory, ExpenditureCategoryProps } from '../../../src/budget/expenditure/category/subcategories/expenditureSubcategory';
import { ExpenditureMainCategory, ExpenditureMainCategoryProps } from '../../../src/budget/expenditure/category/main/expenditureMainCategory';

export function sampleExpenditureCategoryProps(): ExpenditureCategoryProps {
  return {
    name: 'test expenditure category',
    uuid: 'subcategoryUuid'
  };
}

export const expenditureSubcategoryBuilder = (props: ExpenditureCategoryProps = sampleExpenditureCategoryProps()) => {
  return {
    withUuid: (uuid: ExpenditureCategoryProps['uuid']) => expenditureSubcategoryBuilder({ ...props, uuid }),
    withName: (name: ExpenditureCategoryProps['name']) => expenditureSubcategoryBuilder({ ...props, name }),
    valueOf: () => new ExpenditureSubcategory(props)
  };
};

export function sampleExpenditureMainCategoryProps(): ExpenditureMainCategoryProps {
  return {
    name: 'test expenditure category',
    uuid: 'mainCategoryUuid',
    subcategories: [expenditureSubcategoryBuilder().valueOf()]
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
