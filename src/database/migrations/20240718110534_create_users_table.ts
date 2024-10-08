import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('full_name').notNullable();
    table.string('username').unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('phone', 15).notNullable();
    table.string('password').notNullable();
    table.boolean('verified').defaultTo(false);
    table.string('pin', 6).notNullable();
    table.string('account_number').unique().notNullable();
    table.decimal('balance', 14, 2).notNullable();
    table.boolean('enabled').defaultTo(true);
    table.boolean('default_password').defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
