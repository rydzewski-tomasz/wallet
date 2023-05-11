import { DbConnection } from '../../../core/db/dbConnection';
import { Knex } from 'knex';
import dbTimeLog from '../../../core/db/dbTimeLog';
import { ExpenditureCategory, ExpenditureCategoryProps } from './expenditureCategory';
import { Guid } from '../../../core/guid';
import { ExpenditureSubcategory } from './expenditureSubcategory';

export const EXPENDITURE_CATEGORY_TABLE_NAME = 'expenditure_category';
export const EXPENDITURE_SUBCATEGORY_TABLE_NAME = 'expenditure_subcategory';

export interface ExpenditureCategoryRepository {
  findById: (id: Guid) => Promise<ExpenditureCategory | null>;
  findByName: (name: string) => Promise<ExpenditureCategory | null>;
  save: (input: ExpenditureCategory) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryRepositoryImpl implements ExpenditureCategoryRepository {
  private db: Knex;

  constructor({ db }: DbConnection) {
    this.db = db;
  }

  async findById(id: Guid): Promise<ExpenditureCategory | null> {
    const result = await this.getCategoryQuery().where('category.id', id.uuid);
    return result.length ? this.toExpenditureCategory(result) : null;
  }

  async findByName(name: string): Promise<ExpenditureCategory | null> {
    const result = await this.getCategoryQuery().where('category.name', name);
    return result.length ? this.toExpenditureCategory(result) : null;
  }

  private getCategoryQuery() {
    return this.db({ category: EXPENDITURE_CATEGORY_TABLE_NAME }).join({ subcategory: EXPENDITURE_SUBCATEGORY_TABLE_NAME }, 'category.id', 'subcategory.category_id').select({
      category_id: 'category.id',
      category_name: 'category.name',
      subcategory_id: 'subcategory.id',
      subcategory_name: 'subcategory.name'
    });
  }

  async save(input: ExpenditureCategory): Promise<ExpenditureCategory> {
    const { id: categoryId, name, subcategories } = input.toSnapshot();
    await this.db.transaction(async trx => {
      await trx(EXPENDITURE_CATEGORY_TABLE_NAME)
        .insert({ ...dbTimeLog.createTimeLog(), id: categoryId.uuid, name })
        .onConflict('id')
        .merge({ ...dbTimeLog.updateTimeLog(), name });

      await trx(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('category_id', categoryId.uuid).del();

      const subcategoriesToDb = subcategories.map(el => el.toSnapshot()).map(({ name, id }) => ({ ...dbTimeLog.createTimeLog(), name, id: id.uuid, category_id: categoryId.uuid }));
      await trx(EXPENDITURE_SUBCATEGORY_TABLE_NAME).insert(subcategoriesToDb);
    });

    return input;
  }

  private toExpenditureCategory(rows: any[]): ExpenditureCategory {
    const [firstRow] = rows;
    const categoryProps: ExpenditureCategoryProps = {
      id: Guid.fromUuid(firstRow.category_id),
      name: firstRow.category_name,
      subcategories: []
    };

    for (const singleRow of rows) {
      const subcategory = new ExpenditureSubcategory({
        id: Guid.fromUuid(singleRow.subcategory_id),
        name: singleRow.subcategory_name
      });

      categoryProps.subcategories.push(subcategory);
    }

    return new ExpenditureCategory(categoryProps);
  }
}
