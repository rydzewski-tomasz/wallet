import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('category', tableBuilder => {
    tableBuilder.string('uuid', 16).primary();
    tableBuilder.string('name');
  });
}

export async function down(knex: Knex): Promise<void> {
}

