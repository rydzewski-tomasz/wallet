import * as uuid from 'uuid';

export const uuidGenerator = {
  generate(): string {
    return uuid.v4();
  }
};
