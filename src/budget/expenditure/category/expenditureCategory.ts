import { Entity } from '../../../core/entity';

interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureCategory extends Entity {
  constructor(
    private props: ExpenditureCategoryProps
  ) {
    super(props);
  }

  update(input: { name: string }) {
    this.props.name = input.name;
  }

  toSnapshot(): ExpenditureCategoryProps {
    return this.props;
  }
}
