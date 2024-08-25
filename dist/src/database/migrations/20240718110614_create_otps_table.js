"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('otps', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('code').notNullable();
        table
            .uuid('user_id')
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .notNullable();
        // table.boolean('is_used').defaultTo(false);
        table.enum('type', ['REGISTER', 'PASSWORD_RESET', 'LOGIN']).notNullable();
        table.dateTime('expired_date').notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('otps');
}
//# sourceMappingURL=20240718110614_create_otps_table.js.map