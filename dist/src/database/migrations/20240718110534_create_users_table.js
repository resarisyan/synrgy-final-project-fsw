"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    return knex.schema.dropTable('users');
}
//# sourceMappingURL=20240718110534_create_users_table.js.map