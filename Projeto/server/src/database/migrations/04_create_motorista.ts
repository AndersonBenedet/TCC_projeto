import { Knex } from "knex";

export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('motorista', table =>{
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cpf').notNullable();
        table.string('login').notNullable();
        table.string('senha').notNullable();
    })
}

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('motorista')
}