import { ValueObject } from './valueObject';
import { uuidGenerator } from './uuidGenerator';

export interface GuidProps {
  uuid: string;
}

export class Guid extends ValueObject<GuidProps> {
  static create() {
    return new Guid({ uuid: uuidGenerator.generate() });
  }

  static fromUuid(uuid: string) {
    if (!uuidGenerator.validate(uuid)) {
      throw new Error(`Invalid uuid: ${uuid}`);
    }

    return new Guid({ uuid: uuid });
  }

  get uuid() {
    return this.props.uuid;
  }

  constructor(props: GuidProps) {
    super(props);
  }

  equals(valueObject: ValueObject<GuidProps>): boolean {
    return valueObject.props.uuid === this.props.uuid;
  }
}
