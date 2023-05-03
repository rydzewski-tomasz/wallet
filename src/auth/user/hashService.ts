import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export interface HashService {
  generateHash: (text: string) => Promise<string>;
  checkHash: (text: string, hash: string) => Promise<boolean>;
}

export class HashServiceImpl implements HashService {
  generateHash(text: string): Promise<string> {
    return bcrypt.hash(text, SALT_ROUNDS);
  }

  checkHash(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
