import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cash_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.decimal('amount', 14, 2).notNullable();
    table.string('code', 10).notNullable();
    table.enum('type', ['WITHDRAW', 'TOPUP']).notNullable();
    table.boolean('is_success').defaultTo(false);
    table.dateTime('expired_at').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cash_transactions');
}
