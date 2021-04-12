import { Knex } from "knex";


export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('linhas_paradas', table =>{
        table.increments('id').primary();
        table.integer('linha_id').notNullable().references('id').inTable('linha');
        table.integer('parada_id').notNullable().references('id').inTable('parada');
    })
}

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('linhas_paradas')
}