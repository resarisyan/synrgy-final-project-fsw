import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.decimal('balance', 14, 2).notNullable();
    table.string('account_number').unique().notNullable();
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts');
}
