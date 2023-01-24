import { ExpenditureSubcategory } from '../category/subcategories/expenditureSubcategory';
import dayjs from 'dayjs';
import { Entity } from '../../../core/entity';

export interface ExpenseProps {
  uuid: string;
  category: ExpenditureSubcategory;
  description: string;
  date: dayjs.Dayjs;
}

export class Expense extends Entity<ExpenseProps> {
  constructor(props: ExpenseProps) {
    super(props);
  }
}
