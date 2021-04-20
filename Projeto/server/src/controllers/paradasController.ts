import {Request, Response} from 'express';
import knex from '../database/conection';

interface Linha{
    nome: string,
    numero: number,
    rua: string,
    id: number
}

class paradasController {
    async create (request: Request, response: Response) {
        const {
            latitude,
            longitude,
            rua
        } = request.body;
    
        const trx = await knex.transaction();
    
        const ids = await trx('parada').insert({
            latitude, 
            longitude,
            rua
        });
    
        await trx.commit();

        return response.json({ sucess: true});
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const parada = await knex('parada').where('id', id).first();

        if (!parada){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        const linha = await knex('linhas').join('linhas_paradas', 'linhas.id', '=', 'linhas_paradas.linhas_id').where('linhas_paradas.parada_id', id).select('linhas.nome');

        return response.json({parada, linha});
    }

    async getAll (request: Request, response: Response) {
        const parada = await knex('parada');

        if (!parada){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        return response.json({ parada });
    }

    async getParadasLinhas (request: Request, response: Response) {
        const parada = await knex('parada');

        if (!parada){
            return response.status(400).json({ message: 'parada não encontrado'})
        }

        const linha = await knex('linha');

        if (!linha){
            return response.status(400).json({ message: 'linha não encontrado'})
        }

        var Paradas = 
            {
                ParadaLinha: 
                parada.map(itemParada => (
                    {
                        id: itemParada.id,
                        latitude: itemParada.latitude,
                        longitude: itemParada.longitude,
                        Linha:
                        linha.filter(itemLinha => itemLinha.Rua === itemParada.rua)
                    }
                ))
            };

        return response.json({ Paradas });
    }

    async index (request: Request, response: Response) {
        const { linhas } = request.query;

        const parsedLinhas = String(linhas).split(',').map(linha => Number(linha.trim()));

        const paradas = await knex('parada').join('linhas_paradas', 'parada.id', '=', 'linhas_paradas.parada_id').whereIn('linhas_paradas.linha_id', parsedLinhas).distinct().select('parada.*');

        return response.json(paradas)
    }
}

export default paradasController;