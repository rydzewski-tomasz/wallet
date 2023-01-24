import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('expenditure_main_category', tableBuilder => {
    tableBuilder.string('uuid', 16).primary();
    tableBuilder.string('name').notNullable();
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });

  await knex.schema.createTable('expenditure_subcategory', tableBuilder => {
    tableBuilder.string('uuid', 16).primary();
    tableBuilder.string('name').notNullable();
    tableBuilder.string('main_category_uuid', 16).notNullable().references('uuid').inTable('expenditure_main_category');
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });
}

export async function down(_: Knex): Promise<void> {}
