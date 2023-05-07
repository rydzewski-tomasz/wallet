import { ExpenditureSubcategory } from '../category/expenditureSubcategory';
import dayjs from 'dayjs';
import { Entity } from '../../../core/entity';
import { Payee } from '../payee/payee';
import { Money } from '../../../core/money';
import { Uuid } from '../../../core/uuid';

export interface ExpenseProps {
  uuid: Uuid;
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
