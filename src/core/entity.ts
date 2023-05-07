import { Uuid } from './uuid';

export type WithUuid = { uuid: Uuid };

export abstract class Entity<Props extends WithUuid> {
  protected readonly uuid: Uuid;
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.uuid = props.uuid;
    this.props = props;
  }

  getUuid(): Uuid {
    return this.uuid;
  }

  equals(object: Entity<Props>): boolean {
    return this.uuid.equals(object.uuid);
  }

  toSnapshot(): Props {
    return { ...this.props };
  }
}
