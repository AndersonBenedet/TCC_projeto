import {Request, Response} from 'express';
import knex from '../database/conection';

class linhasController {
    async index(request: Request, response: Response) {
        const linhas = await knex('linha').select('*');
    
        const serializedLinhas = linhas.map(linha => {
            return {
                id: linha.id,
                nome: linha.nome,
                numero: linha.numero
            }
        });
    
        return response.json(serializedLinhas);
    }
}

export default linhasController;