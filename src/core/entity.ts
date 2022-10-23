export type WithUuid = { uuid: string };

export abstract class Entity<Props extends WithUuid> {
  protected readonly uuid: string;
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.uuid = props.uuid;
    this.props = props;
  }

  getUuid(): string {
    return this.uuid;
  }

  equals(object: Entity<Props>): boolean {
    return this.uuid === object.uuid;
  }

  toSnapshot(): Props {
    return this.props;
  }
}
