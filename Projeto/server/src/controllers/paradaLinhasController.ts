import {Request, Response} from 'express';
import knex from '../database/conection';

class paradasLinhasController {
    async create (linhaId: number, paradaId: number) {
        try{
            var maior_ordem = await knex('linhas_paradas_ordem').where('linha_id', linhaId).select('ordem').first().max('ordem');
            
            const ordem = maior_ordem?.ordem +1

            const ids = await knex('linhas_paradas_ordem').insert({
                linha_id: linhaId, 
                parada_id: paradaId,
                subir: 0,
                descer: 0,
                quantidade: 0,
                ordem
            });
        
            var linhas_paradas_ordem = await knex('linhas_paradas_ordem').where('id', ids).first();

            return linhas_paradas_ordem;
        }catch(error){
            console.log(error)
            return
        }
    }

}

class ControleParadasLinhas extends paradasLinhasController{
    /*
    async subir (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_ordem').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

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

        await trx('linhas_paradas_ordem').update({
            subir: linha_parada.subir
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }

    async descer (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_ordem').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

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

        await trx('linhas_paradas_ordem').update({
            descer: linha_parada.descer
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }*/

    async criar (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_ordem').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

        if (!linha_parada){
            try {
                linha_parada = await super.create(linhaId, paradaId)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }

        return response.json(linha_parada);
    }

    async buscar (request: Request, response: Response) {
        const { id_linha } = request.params;

        var linha_parada = await knex('linhas_paradas_ordem').where('linha_id', id_linha).select('*');

        if (!linha_parada){
            return response.status(400).json({ message: 'Não foi possivel encontrar linha/parada'})
        }

        return response.json(linha_parada);
    }

    async limpar (request: Request, response: Response) {
        const { id } = request.body;

        var linha_parada = await knex('linhas_paradas_ordem').where('id', id).select('*').first();

        if (!linha_parada){
            return response.status(400).json({ message: 'Não foi possivel encontrar linha/parada'})
        }

        const trx = await knex.transaction();
    
        linha_parada.descer = 0
        linha_parada.subir = 0

        await trx('linhas_paradas_ordem').update({
            descer: linha_parada.descer,
            subir: linha_parada.subir
        }).where('id', linha_parada.id);

        await trx.commit();

        return response.json(linha_parada);
    }

    async quantidade_controle (request: Request, response: Response) {
        const { linhaId, paradaIdSubir, paradaIdDescer } = request.body;

        var linha_parada_subir = await knex('linhas_paradas_ordem').where('linha_id', linhaId).where('parada_id', paradaIdSubir).select('*').first();
        var linha_parada_descer = await knex('linhas_paradas_ordem').where('linha_id', linhaId).where('parada_id', paradaIdDescer).select('*').first();

        if (!linha_parada_subir){
            try {
                linha_parada_subir = await super.create(linhaId, paradaIdSubir)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada_subir) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }

        if (!linha_parada_descer){
            try {
                linha_parada_descer = await super.create(linhaId, paradaIdDescer)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada_descer) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }
        
        await knex('linhas_paradas_ordem').increment('quantidade').where('linha_id', linhaId).whereBetween('ordem', [linha_parada_subir.ordem+1, linha_parada_descer.ordem-1])

        const trx = await knex.transaction();
    
        linha_parada_subir.subir += 1
        linha_parada_descer.descer += 1

        await trx('linhas_paradas_ordem').update({
            subir: linha_parada_subir.subir
        }).where('id', linha_parada_subir.id);

        await trx('linhas_paradas_ordem').update({
            descer: linha_parada_descer.descer
        }).where('id', linha_parada_descer.id);

        await trx.commit();

        var linha_parada = await knex('linhas_paradas_ordem').where('linha_id', linhaId).whereBetween('ordem', [linha_parada_subir.ordem, linha_parada_descer.ordem]).select('*');

        return response.json({
            paradaLinhaInicial: linha_parada_subir.parada_id, 
            paradaLinhaFinal: linha_parada_descer.parada_id
        });
    }


}

export default ControleParadasLinhas;