import { Entity } from '../../../core/entity';
import { Uuid } from '../../../core/uuid';

export interface ExpenditureSubcategoryProps {
  uuid: Uuid;
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
