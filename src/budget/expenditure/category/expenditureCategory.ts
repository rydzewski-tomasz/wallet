import { ExpenditureSubcategory } from './expenditureSubcategory';
import { Entity } from '../../../core/entity';
import { Guid } from '../../../core/guid';

export interface ExpenditureCategoryProps {
  id: Guid;
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
    const exists = this.props.subcategories.find(singleSubcategory => singleSubcategory.name === subcategory.name);
    if (exists) {
      throw new Error('SubcategoryAlreadyExists');
    } else {
      this.props.subcategories.push(subcategory);
    }
  }

  removeSubcategory(subcategory: ExpenditureSubcategory) {
    this.props.subcategories = this.props.subcategories.filter(singleSubcategory => !singleSubcategory.equals(subcategory));
  }
}
