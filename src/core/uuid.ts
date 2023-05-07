import { ValueObject } from './valueObject';

export interface UuidProps {
  value: string;
}

export class Uuid extends ValueObject<UuidProps> {
  static create(value: string) {
    return new Uuid({ value });
  }

  get value() {
    return this.props.value;
  }

  constructor(props: UuidProps) {
    super(props);
  }

  equals(valueObject: ValueObject<UuidProps>): boolean {
    return valueObject.props.value === this.props.value;
  }
}
