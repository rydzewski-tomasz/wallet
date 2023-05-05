import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashService = {
  generateHash(text: string): Promise<string> {
    return bcrypt.hash(text, SALT_ROUNDS);
  },

  checkHash(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
};
