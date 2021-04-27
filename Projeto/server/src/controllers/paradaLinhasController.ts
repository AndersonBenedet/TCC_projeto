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

            const trx = await knex.transaction();
        
            const ids = await trx('linhas_paradas_coontador').insert({
                linhaId, 
                paradaId,
                subir,
                descer
            });
        
            await trx.commit();

            var linhas_paradas_coontador = await knex('linhas_paradas_coontador').where('id', ids).first();

            return linhas_paradas_coontador;
        }catch(error){
            console.log(error)
            return undefined
        }
    }

    async subir (request: Request, response: Response) {
        const { linhaId, paradaId } = request.body;

        var linha_parada = await knex('linhas_paradas_coontador').where('linha_id', linhaId).where('parada_id', paradaId).select('*').first();

        if (!linha_parada){
            try {
                linha_parada = await this.create(request)
            }catch(error){
                console.log(error)
            }
            
            if (!linha_parada) return response.status(400).json({ message: 'Não foi possivel criar linha/parada'})
        }

        const trx = await knex.transaction();
    
        linha_parada.subir = linha_parada.subir++

        await trx('linhas_paradas_coontador').update({
            linha_parada
        });

        await trx.commit();

        return response.json(linha_parada);
    }

}

export default paradasLinhasController;