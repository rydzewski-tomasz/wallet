import { ExpenditureSubcategory } from '../category/expenditureSubcategory';
import dayjs from 'dayjs';
import { Entity } from '../../../core/entity';
import { Payee } from '../payee/payee';
import { Money } from '../../../core/money';
import { Guid } from '../../../core/guid';

export interface ExpenseProps {
  uuid: Guid;
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
