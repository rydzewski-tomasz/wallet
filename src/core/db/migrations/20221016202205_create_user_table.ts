import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE user_status AS ENUM ('New', 'Active', 'Deleted')`);

  return knex.schema.createTable('user', tableBuilder => {
    tableBuilder.string('uuid', 36).primary();
    tableBuilder.string('login').unique().notNullable();
    tableBuilder.string('password', 255).notNullable();
    tableBuilder.specificType('status', 'user_status').notNullable();
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> { }
