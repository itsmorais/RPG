/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('jogadores', (table) => {
        table.increments('id').primary();
        table.string("name").notNullable();
        table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE');
        table.integer('xp').notNullable();
        table.boolean('confirmed').defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('jogadores');
};
