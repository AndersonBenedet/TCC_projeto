import express from 'express';

import paradasController from './controllers/paradasController'
import linhasController from './controllers/linhasController'

const routes = express.Router();
const paradascontroller = new paradasController();
const linhascontroller = new linhasController();

routes.get('/', (request, response) => {
    return response.json({message: 'hello world'})
})

routes.get('/linhas', linhascontroller.index);
routes.get('/linhas/:rua', linhascontroller.buscarRua);
routes.get('/linhas-id/:id', linhascontroller.show);
routes.post('/parada', paradascontroller.create);
routes.post('/parada', paradascontroller.index);
routes.get('/parada/:id', paradascontroller.show);
routes.get('/paradaAll', paradascontroller.getAll);
routes.get('/getParadasLinhas', paradascontroller.getParadasLinhas);

export default routes;