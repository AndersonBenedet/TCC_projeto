import {Request, Response} from 'express';
import knex from '../database/conection';

class linhasController {
    async index(request: Request, response: Response) {
        const motorista = await knex('motorista').select('*');
    
        const serializedLinhas = motorista.map(mot => {
            return {
                id: mot.id,
                nome: mot.nome,
                cpf: mot.cpf,
                login: mot.login,
                senha: mot.senha
            }
        });
    
        return response.json(serializedLinhas);
    }

    async logar (request: Request, response: Response) {
        const { usuario, password } = request.body;

        const user = await knex('usuario').where('login', usuario).where('senha', password).first();

        if (!user ){
            return response.status(400).json({ message: 'Usuario ou senha errados'})
        }

        return response.json(user);
    }

    async criar (request: Request, response: Response) {
        const {
            nome,
            cpf,
            usuario,
            senha,
        } = request.body;
    
        const trx = await knex.transaction();
    
        var usuarios = await trx('usuario')
                            .join('motorista', 'motorista.login', '=', 'usuario.login').where('usuario.senha', '=', 'motorista.senha')
                            .where('usuario.login', usuario)
                            .where('usuario.senha', senha);

        if (!usuarios ){
            return response.status(400).json({ message: 'Usuario ou senha errados'})
        }else{
            if (usuarios.length > 1){
                return response.status(400).json({ message: 'Usuario já cadastrado'})
            }
        }

        const user = await trx('usuario').where('login', usuario).where('senha', senha).first();

        const ids = await trx('motorista').insert({
            nome: nome,
            cpf: cpf,
            login: usuario, 
            senha: senha
        });

        if (!ids ){
            return response.status(400).json({ message: 'Não foi possivel cadastrar motorista'})
        }

        await trx('usuario').update({
            nivel: 1
        }).where('id', user.id);
    
        await trx.commit();

        return response.json({ sucess: true});
    }

}

export default linhasController;