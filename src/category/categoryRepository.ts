import { DbConnection } from '../core/db/dbConnection';
import { Category } from './category';
import { Knex } from 'knex';

export const CATEGORY_TABLE_NAME = 'category';

export interface CategoryRepository {
  save: (input: Category) => Promise<Category>;
}

export class CategoryRepositoryImpl implements CategoryRepository {
  private db: Knex;

  constructor(
    { db }: DbConnection
  ) {
    this.db = db;
  }

  async save(input: Category): Promise<Category> {
    await this.db(CATEGORY_TABLE_NAME)
      .insert(input.toSnapshot())
      .onConflict('uuid')
      .merge();
    return input;
  }
}
