import { ExpenditureSubcategory } from './expenditureSubcategory';
import { Entity } from '../../../core/entity';

export interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
  subcategories: ExpenditureSubcategory[];
}

export class ExpenditureCategory extends Entity<ExpenditureCategoryProps> {
  constructor(props: ExpenditureCategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }

  addSubcategory(subcategory: ExpenditureSubcategory) {
    const exists = this.props.subcategories.find(singleSubcategory => singleSubcategory.equals(subcategory));
    if (!exists) {
      this.props.subcategories.push(subcategory);
    }
  }

  removeSubcategory(subcategory: ExpenditureSubcategory) {
    this.props.subcategories = this.props.subcategories.filter(singleSubcategory => !singleSubcategory.equals(subcategory));
  }
}
