import { UuidGenerator } from '../../core/uuidGenerator';
import { AuthUser, UserStatus, UserType } from './authUser';

export interface AuthUserFactory {
  create: () => AuthUser;
}

export class UserFactoryImpl {
  constructor(private uuidGenerator: UuidGenerator) {}

  create(): AuthUser {
    const uuid = this.uuidGenerator.generate();
    return new AuthUser({ uuid, username: '', passwordHash: '', status: UserStatus.New, type: UserType.User });
  }
}
