import { Entity } from '../../../core/entity';

export interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureCategory extends Entity<ExpenditureCategoryProps> {
  constructor(props: ExpenditureCategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }
}
