import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('expenditure_category', tableBuilder => {
    tableBuilder.string('uuid', 16).primary();
    tableBuilder.string('name').notNullable();
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
