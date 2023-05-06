import { ExpenseProps } from './expense';

export interface ExpenseService {
  create: (input: Pick<ExpenseProps, 'description' | 'category' | 'date' | 'amount'>) => Promise<void>;
}
