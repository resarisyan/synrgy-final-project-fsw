import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('mutations', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.decimal('amount', 14, 2).notNullable();
    table
      .enum('type', ['TRANSFER', 'TRANSFER_QR', 'WITHDRAW', 'TOPUP'])
      .notNullable();
    table.string('description').nullable();
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.string('account_number').nullable();
    table.enum('transaction', ['DEBIT', 'CREDIT']).notNullable();
    table.string('keperluan').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('mutations');
}
