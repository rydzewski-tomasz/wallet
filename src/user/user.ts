
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
    private props: UserProps
  ) { }

  remove() {
    this.props.status = UserStatus.Deleted;
  }

  toSnapshot(): UserProps {
    return this.props;
  }
}

