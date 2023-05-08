import dayjs from 'dayjs';
import { ExpenditureSubcategory } from '../category/expenditureSubcategory';

export interface ExpenseService {
  add: (input: { date: dayjs.Dayjs; category: ExpenditureSubcategory; describe: string; amount: string; payeeId: string }) => Promise<void>;
}

export class ExpenseServiceImpl implements ExpenseService {
  async add(): Promise<void> {
    throw new Error('Not implemented');
  }
}
