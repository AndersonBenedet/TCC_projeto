import { Knex } from 'knex';

/*export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('linha', table =>{
        table.increments('id').primary();
        table.string('Nome').notNullable();
        table.integer('Numero').notNullable();
    });
}*/

exports.up = function (knex: Knex) {
    return knex.schema
        .hasTable('linha')
        .then(function (exists) {
            if (!exists) {
              return knex // **** udpate
                    .schema
                    .createTable('linha', function (table) {
                        table.increments('id').primary();
                        table.string('Nome').notNullable();
                        table.integer('Numero').notNullable();
                    })
            }
        });
};

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('linha')
}