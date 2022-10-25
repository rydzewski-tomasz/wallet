import { Entity } from '../../../core/entity';

interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureCategory extends Entity<ExpenditureCategoryProps> {
  constructor(props: ExpenditureCategoryProps) {
    super(props);
  }

  update(input: { name: string }) {
    this.props.name = input.name;
  }

  toSnapshot(): ExpenditureCategoryProps {
    return this.props;
  }
}
