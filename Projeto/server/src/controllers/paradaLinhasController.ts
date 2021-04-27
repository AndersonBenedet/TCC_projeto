import {Request, Response} from 'express';
import knex from '../database/conection';

class paradasLinhasController {
    async create (request: any) {
        try{
            var {
                linhaId,
                paradaId
            } = request.body;
        
            var subir = 0;
            var descer = 0;

            const ids = await knex('linhas_paradas_coontador').insert({
                linha_id: linhaId, 
                parada_id: paradaId,
                subir,
                descer
            });
        
            var linhas_paradas_coontador = await knex('linhas_paradas_coontador').where('id', ids).first();

            return linhas_paradas_coontador;
        }catch(error){
            console.log(error)
            return
        }
    }

}

class ControleParadasLinhas extends paradasLinhasController{
    async subir (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_coontador').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

        if (!linha_parada){
            try {
                linha_parada = await super.create(request)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }

        const trx = await knex.transaction();
    
        linha_parada.subir += 1

        await trx('linhas_paradas_coontador').update({
            subir: linha_parada.subir
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }

    async descer (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_coontador').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

        if (!linha_parada){
            try {
                linha_parada = await super.create(request)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }

        const trx = await knex.transaction();
    
        linha_parada.descer += 1

        await trx('linhas_paradas_coontador').update({
            descer: linha_parada.descer
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }

    async buscar (request: Request, response: Response) {
        const { id_paradalinha } = request.params;

        var linha_parada = await knex('linhas_paradas_coontador').where('id', id_paradalinha).select('*').first();

        if (!linha_parada){
            return response.status(400).json({ message: 'Não foi possivel encontrar linha/parada'})
        }

        return response.json(linha_parada);
    }

    async limpar (request: Request, response: Response) {
        const { id } = request.body;

        var linha_parada = await knex('linhas_paradas_coontador').where('id', id).select('*').first();

        if (!linha_parada){
            return response.status(400).json({ message: 'Não foi possivel encontrar linha/parada'})
        }

        const trx = await knex.transaction();
    
        linha_parada.descer = 0
        linha_parada.subir = 0

        await trx('linhas_paradas_coontador').update({
            descer: linha_parada.descer,
            subir: linha_parada.subir
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }
}

export default ControleParadasLinhas;