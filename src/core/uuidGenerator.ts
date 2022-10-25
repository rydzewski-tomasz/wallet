import * as uuid from 'uuid';

export class UuidGenerator {
  generate(): string {
    return uuid.v4();
  }
}
