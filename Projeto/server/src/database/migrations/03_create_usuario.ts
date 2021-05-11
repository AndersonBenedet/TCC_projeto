import { Knex } from "knex";

export async function up(knex: Knex) {
    //criar tabela
    return knex.schema.createTable('usuario', table =>{
        table.increments('id').primary();
        table.string('login').notNullable();
        table.string('senha').notNullable();
        table.integer('nivel').notNullable().defaultTo(0);
    })
}

export async function down(knex: Knex) {
    //voltar atras
    return knex.schema.dropTable('usuario')
}