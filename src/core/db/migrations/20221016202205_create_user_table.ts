import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE user_status AS ENUM ('New', 'Active', 'Unverified', 'Deleted')`);
  await knex.raw(`CREATE TYPE user_type AS ENUM ('Admin', 'User')`);

  return knex.schema.createTable('user', tableBuilder => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('username').unique().notNullable();
    tableBuilder.string('password', 255).notNullable();
    tableBuilder.specificType('status', 'user_status').notNullable();
    tableBuilder.specificType('type', 'user_type').notNullable();
    tableBuilder.timestamp('created', { useTz: false, precision: 0 }).defaultTo(knex.fn.now()).notNullable();
    tableBuilder.timestamp('updated', { useTz: false, precision: 0 }).notNullable();
  });
}

export async function down(_: Knex): Promise<void> {}
