import { DbConnection } from '../../../core/db/dbConnection';
import { ExpenditureCategory } from './expenditureCategory';
import { Knex } from 'knex';

export const EXPENDITURE_CATEGORY_TABLE_NAME = 'expenditure_category';

export interface ExpenditureCategoryRepository {
  save: (input: ExpenditureCategory) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryRepositoryImpl implements ExpenditureCategoryRepository {
  private db: Knex;

  constructor(
    { db }: DbConnection
  ) {
    this.db = db;
  }

  async save(input: ExpenditureCategory): Promise<ExpenditureCategory> {
    await this.db(EXPENDITURE_CATEGORY_TABLE_NAME)
      .insert(input.toSnapshot())
      .onConflict('uuid')
      .merge();
    return input;
  }
}
