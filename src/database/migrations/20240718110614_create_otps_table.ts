import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('otps', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('otp').notNullable();
    table
      .uuid('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    table.boolean('is_used').defaultTo(false);
    table.dateTime('expired_at').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('otps');
}
