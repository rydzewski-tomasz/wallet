import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export interface HashService {
  generateHash: (text: string) => Promise<string>;
}

export class HashServiceImpl implements HashService {
  generateHash(text: string): Promise<string> {
    return bcrypt.hash(text, SALT_ROUNDS);
  }
}
