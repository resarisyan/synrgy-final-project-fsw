"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    return knex.schema.dropTable('cash_transactions');
}
//# sourceMappingURL=20240726062556_create_cash_transactions_table.js.map