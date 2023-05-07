import * as uuid from 'uuid';
import { Uuid } from './uuid';

export const uuidGenerator = {
  generate(): Uuid {
    return Uuid.create(uuid.v4());
  }
};
