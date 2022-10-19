
interface ExpenditureCategoryProps {
  uuid: string;
  name: string;
}

export class ExpenditureCategory {
  constructor(
    private props: ExpenditureCategoryProps
  ) { }

  update(input: { name: string }) {
    this.props.name = input.name;
  }

  toSnapshot(): ExpenditureCategoryProps {
    return this.props;
  }
}
