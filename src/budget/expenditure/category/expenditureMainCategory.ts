import { ExpenditureCategory } from './expenditureCategory';

interface ExpenditureMainCategoryProps {
  uuid: string;
  name: string;
  subcategories: ExpenditureCategory[];
}

export class ExpenditureMainCategory extends ExpenditureCategory {
  constructor(props: ExpenditureMainCategoryProps) {
    super(props);
  }

  addSubcategory() {}

  removeSubcategory() {}
}
