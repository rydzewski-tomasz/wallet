import { Entity } from '../../../core/entity';

export interface ExpenditureSubcategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureSubcategory extends Entity<ExpenditureSubcategoryProps> {
  constructor(props: ExpenditureSubcategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }
}
