import { Entity } from '../../../core/entity';
import { Guid } from '../../../core/guid';

export interface PayeeProps {
  uuid: Guid;
  name: string;
}

export class Payee extends Entity<PayeeProps> {
  constructor(props: PayeeProps) {
    super(props);
  }
}
