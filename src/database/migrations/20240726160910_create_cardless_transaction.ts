import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cardless_transaction', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.decimal('amount', 14, 2);
    table.dateTime('expired_at').notNullable();
    table.string('token', 10).notNullable();
    table.boolean('status').defaultTo(false);
    table.enum('type', ['WITHDRAW', 'DEPOSIT']).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cardless_transaction');
}
