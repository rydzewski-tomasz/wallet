import { ExpenditureSubcategory } from '../category/expenditureSubcategory';
import dayjs from 'dayjs';
import { Entity } from '../../../core/entity';
import { Payee } from '../payee/payee';
import { Money } from '../../../core/money';

export interface ExpenseProps {
  uuid: string;
  date: dayjs.Dayjs;
  category: ExpenditureSubcategory;
  amount: Money;
  payee: Payee;
  description: string;
}

export class Expense extends Entity<ExpenseProps> {
  constructor(props: ExpenseProps) {
    super(props);
  }
}
