import * as uuid from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const uuidGenerator = {
  generate(): string {
    return uuid.v4();
  },
  validate(uuid: string): boolean {
    return uuidValidate(uuid);
  }
};
