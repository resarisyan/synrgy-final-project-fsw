import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('mutations', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.decimal('amount', 14, 2).notNullable();
    table.string('description').nullable();
    table.boolean('is_favorites').defaultTo(false);
    table.enum('mutation_type', ['QRIS', 'TRANSFER']).notNullable();
    table.string('account_number').notNullable();
    table.string('full_name').notNullable();
    table
      .enum('transaction_purpose', [
        'OTHER',
        'INVESTMENT',
        'WEALTH_TRANSFER',
        'PURCHASE'
      ])
      .notNullable();
    table.enum('transaction_type', ['DEBIT', 'CREDIT']).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('mutations');
}
