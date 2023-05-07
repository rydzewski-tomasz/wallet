import { Entity } from '../../../core/entity';
import { Uuid } from '../../../core/uuid';

export interface PayeeProps {
  uuid: Uuid;
  name: string;
}

export class Payee extends Entity<PayeeProps> {
  constructor(props: PayeeProps) {
    super(props);
  }
}
