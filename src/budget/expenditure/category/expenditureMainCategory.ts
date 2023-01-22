import { ExpenditureCategory } from './expenditureCategory';
import { Entity } from '../../../core/entity';

export interface ExpenditureMainCategoryProps {
  uuid: string;
  name: string;
  subcategories: ExpenditureCategory[];
}

export class ExpenditureMainCategory extends Entity<ExpenditureMainCategoryProps> {
  constructor(props: ExpenditureMainCategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }

  addSubcategory(subcategory: ExpenditureCategory) {
    const exists = this.props.subcategories.find(singleSubcategory => singleSubcategory.equals(subcategory));
    if (!exists) {
      this.props.subcategories.push(subcategory);
    }
  }

  // @ts-ignore
  removeSubcategory(subcategory: ExpenditureCategory) {
    this.props.subcategories = this.props.subcategories.filter(singleSubcategory => !singleSubcategory.equals(subcategory));
  }
}
