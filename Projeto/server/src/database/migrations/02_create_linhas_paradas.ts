import { Knex } from "knex";


export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('linhas_paradas_ordem', table =>{
        table.increments('id').primary();
        table.integer('linha_id').notNullable().references('id').inTable('linha');
        table.integer('parada_id').notNullable().references('id').inTable('parada');
        table.integer('quantidade').notNullable().defaultTo(0);
        table.integer('subir').notNullable().defaultTo(0);
        table.integer('descer').notNullable().defaultTo(0);
        table.integer('ordem').notNullable().defaultTo(0);
    })
}

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('linhas_paradas_ordem')
}