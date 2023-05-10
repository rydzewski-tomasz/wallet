import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('expenditure_category', tableBuilder => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('name').unique().notNullable();
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });

  await knex.schema.createTable('expenditure_subcategory', tableBuilder => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('name').notNullable();
    tableBuilder.uuid('category_id').notNullable().references('id').inTable('expenditure_category');
    tableBuilder.unique(['name', 'category_id']);
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });
}

export async function down(_: Knex): Promise<void> {}
