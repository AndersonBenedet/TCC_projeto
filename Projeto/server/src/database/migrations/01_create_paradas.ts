import { Knex } from "knex";


export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('parada', table =>{
        table.increments('id').primary();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('rua').notNullable();
    })
}

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('parada')
}