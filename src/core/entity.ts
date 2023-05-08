import { Guid } from './guid';

export type WithId = { id: Guid };

export abstract class Entity<Props extends WithId> {
  protected readonly id: Guid;
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.id = props.id;
    this.props = props;
  }

  getId(): Guid {
    return this.id;
  }

  equals(object: Entity<Props>): boolean {
    return this.id.equals(object.id);
  }

  toSnapshot(): Props {
    return { ...this.props };
  }
}
