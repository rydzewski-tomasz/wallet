import { UuidGenerator } from '../core/uuidGenerator';
import { User, UserStatus } from './user';

export interface UserFactory {
  create: () => User;
}

export class UserFactoryImpl {
  constructor(private uuidGenerator: UuidGenerator) {}

  create(): User {
    const uuid = this.uuidGenerator.generate();
    return new User({ uuid, login: '', passwordHash: '', status: UserStatus.New });
  }
}
