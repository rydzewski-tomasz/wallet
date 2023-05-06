import { ValueObject } from './valueObject';

export interface MoneyProps {
  amount: number;
}

export class Money extends ValueObject<MoneyProps> {
  equals(valueObject: ValueObject<MoneyProps>): boolean {
    return this.props.amount === valueObject.props.amount;
  }
}
