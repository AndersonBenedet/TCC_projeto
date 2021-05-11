import {Request, Response} from 'express';
import knex from '../database/conection';

class linhasController {
    async index(request: Request, response: Response) {
        const usuario = await knex('usuario').select('*');
    
        const serializedLinhas = usuario.map(usuario => {
            return {
                id: usuario.id,
                login: usuario.login,
                senha: usuario.senha,
                nivel: usuario.nivel
            }
        });
    
        return response.json(serializedLinhas);
    }

    async logar (request: Request, response: Response) {
        const { usuario, password } = request.body;

        const user = await knex('usuario').where('login', usuario).where('senha', password).first();

        if (!user ){
            return response.status(401).json({ message: 'Usuario ou senha errados'})
        }

        return response.json(user);
    }

    async criar (request: Request, response: Response) {
        const {
            username,
            password
        } = request.body;
    
        const trx = await knex.transaction();
    
        const ids = await trx('usuario').insert({
            login: username, 
            senha: password,
            nivel: 0
        });
    
        await trx.commit();

        return response.json({ sucess: true});
    }

}

export default linhasController;