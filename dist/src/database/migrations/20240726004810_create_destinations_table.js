"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('destinations', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table
            .uuid('user_id')
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .notNullable();
        table.string('name').notNullable();
        table.string('account_number').notNullable();
        table.boolean('is_favorites').defaultTo(false);
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('destinations');
}
//# sourceMappingURL=20240726004810_create_destinations_table.js.map