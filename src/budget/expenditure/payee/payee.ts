import { Entity } from '../../../core/entity';

export interface PayeeProps {
  uuid: string;
  name: string;
}

export class Payee extends Entity<PayeeProps> {
  constructor(props: PayeeProps) {
    super(props);
  }
}
