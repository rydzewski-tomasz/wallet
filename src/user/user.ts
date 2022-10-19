
export enum UserStatus {
  New = 'New',
  Active = 'Active',
  Deleted = 'Deleted'
}

interface UserProps {
  uuid: string;
  name: string;
  password: string;
  status: UserStatus
}

export class User {
  constructor(
    private userProps: UserProps
  ) { }

  toSnapshot(): UserProps {
    return this.userProps;
  }
}

