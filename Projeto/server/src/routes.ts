import express from 'express';

import paradasController from './controllers/paradasController'
import linhasController from './controllers/linhasController'
import paradasLinhasController from './controllers/paradaLinhasController'

const routes = express.Router();
const paradascontroller = new paradasController();
const linhascontroller = new linhasController();
const paradaslinhascontroller = new paradasLinhasController();

//Linhas
routes.get('/linhas', linhascontroller.index);
routes.get('/linhas/:rua', linhascontroller.buscarRua);
routes.get('/linhas-id/:id', linhascontroller.show);

//Paradas
routes.post('/parada', paradascontroller.create);
routes.post('/parada', paradascontroller.index);
routes.get('/parada/:id', paradascontroller.show);
routes.get('/paradaAll', paradascontroller.getAll);

//Paradas/Linhas
routes.get('/getParadasLinhas', paradascontroller.getParadasLinhas);
routes.get('/buscar/:id_linha', paradaslinhascontroller.buscar);
//routes.post('/subir', paradaslinhascontroller.subir);
//routes.post('/descer', paradaslinhascontroller.descer);
routes.post('/controle', paradaslinhascontroller.quantidade_controle);


routes.post('/limpar', paradaslinhascontroller.limpar);

//Nao Usar em funções
routes.post('/criar_linha_parada', paradaslinhascontroller.criar);

export default routes;