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

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const linha = await knex('linha').where('id', id).first();

        if (!linha){
            return response.status(400).json({ message: 'linha não encontrado'})
        }

        const parada = await knex('linha').join('parada', 'linha.Rua', 'like', 'parada.rua').where('linha.id', id).select('parada.*');

        if (!parada){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        var Linhas = 
        {
            Linha: 
            {
                id: linha.id,
                nome: linha.Nome,
                numero: linha.Numero,
                ruas: linha.Rua,
                Paradas: parada
            }
        };

        return response.json({Linhas});
    }

    async buscarRua (request: Request, response: Response) {
        const { rua } = request.params;

        const linhas = await knex('linha').where('Rua', rua);

        if (!linhas){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        return response.json({linhas});
    }

    async getAll (request: Request, response: Response) {
        const linha = await knex('linha');

        if (!linha){
            return response.status(400).json({ message: 'linha não encontrado'})
        }

        return response.json({linha});
    }

}

export default linhasController;