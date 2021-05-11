import { Knex } from 'knex';

export async function seed(knex: Knex){
    await knex('usuario').insert([
        {
            login: 'admin',
            senha: 'admin',
            nivel: 1
        }
    ]);

    await knex('motorista').insert([
        {
            nome: 'Gerente',
            cpf: '123.123.123-10',
            login: 'admin',
            senha: 'admin'
        }
    ]);
}