import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.decimal('amount', 14, 2).notNullable();
    table
      .enum('type', ['TRANSFER', 'TRANSFER_QR', 'WITHDRAW', 'TOPUP'])
      .notNullable();
    table.string('description').notNullable();
    table
      .uuid('account_id')
      .references('accounts.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.string('receiver_account_number').nullable();
    table.string('receiver_bank_code').nullable();
    table.string('receiver_name').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
