import { Knex } from 'knex';

export async function seed(knex: Knex){
    await knex('linha').insert([
        {
            Nome: 'Teste',
            Numero: 123 ,
            Rua: [
                'Rua Visconde de Cairu'
            ]
        },
        {
            Nome: 'Teste2',
            Numero: 321 ,
            Rua: [
                'Rua Visconde de Cairu'
            ]
        },
        {
            Nome: 'Teste3',
            Numero: 231 ,
            Rua: [
                'Avenida centenario'
            ]
        },
    ]);
}