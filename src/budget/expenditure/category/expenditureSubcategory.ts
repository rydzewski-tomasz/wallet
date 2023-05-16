import { Entity } from '../../../core/entity';
import { Guid } from '../../../core/guid';

export interface ExpenditureSubcategoryProps {
  id: Guid;
  name: string;
}

export class ExpenditureSubcategory extends Entity<ExpenditureSubcategoryProps> {
  get name(): string {
    return this.props.name;
  }

  constructor(props: ExpenditureSubcategoryProps) {
    super(props);
  }

  changeName(name: string) {
    this.props.name = name;
  }
}
