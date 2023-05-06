import { DbConnection } from '../../../core/db/dbConnection';
import { Knex } from 'knex';
import dbTimeLog from '../../../core/db/dbTimeLog';
import { ExpenditureCategory } from './expenditureCategory';

export const EXPENDITURE_MAIN_CATEGORY_TABLE_NAME = 'expenditure_main_category';
export const EXPENDITURE_SUBCATEGORY_TABLE_NAME = 'expenditure_subcategory';

export interface ExpenditureCategoryRepository {
  save: (input: ExpenditureCategory) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryRepositoryImpl implements ExpenditureCategoryRepository {
  private db: Knex;

  constructor({ db }: DbConnection) {
    this.db = db;
  }

  async save(input: ExpenditureCategory): Promise<ExpenditureCategory> {
    const { uuid: mainUuid, name, subcategories } = input.toSnapshot();
    await this.db.transaction(async trx => {
      await trx(EXPENDITURE_MAIN_CATEGORY_TABLE_NAME)
        .insert({ ...dbTimeLog.createTimeLog(), uuid: mainUuid, name })
        .onConflict('uuid')
        .merge({ ...dbTimeLog.updateTimeLog(), name });

      await trx(EXPENDITURE_SUBCATEGORY_TABLE_NAME).where('main_category_uuid', mainUuid).del();

      const subcategoriesToDb = subcategories.map(el => el.toSnapshot()).map(({ name, uuid }) => ({ ...dbTimeLog.createTimeLog(), name, uuid, main_category_uuid: mainUuid }));
      await trx(EXPENDITURE_SUBCATEGORY_TABLE_NAME).insert(subcategoriesToDb);
    });

    return input;
  }
}
