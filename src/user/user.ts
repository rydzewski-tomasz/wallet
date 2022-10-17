
export enum UserStatus {
  New = 'New',
  Active = 'Active',
  Deleted = 'Deleted'
}

export class User {
  constructor(
    private uuid: string,
    private name: string,
    private password: string,
    private status: UserStatus
  ) { }

  toSnapshot() {
    return {
      uuid: this.uuid,
      name: this.name,
      password: this.password,
      status: this.status
    };
  }
}

