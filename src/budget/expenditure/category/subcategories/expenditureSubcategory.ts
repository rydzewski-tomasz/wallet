import { Entity } from '../../../../core/entity';

export interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureSubcategory extends Entity<ExpenditureCategoryProps> {
  constructor(props: ExpenditureCategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }
}
