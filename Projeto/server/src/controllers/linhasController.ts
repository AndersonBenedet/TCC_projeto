import {Request, Response} from 'express';
import knex from '../database/conection';

class linhasController {
    async index(request: Request, response: Response) {
        const linhas = await knex('linha').select('*');
    
        const serializedLinhas = linhas.map(linha => {
            return {
                id: linha.id,
                nome: linha.nome,
                numero: linha.numero,
                ruas: linha.rua
            }
        });
    
        return response.json(serializedLinhas);
    }

    async buscarRua (request: Request, response: Response) {
        const { rua } = request.params;

        const linhas = await knex('linha').where('Rua', rua);

        if (!linhas){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        return response.json({linhas});
    }
}

export default linhasController;