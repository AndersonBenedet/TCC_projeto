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
routes.post('/parada', paradascontroller.create);
routes.post('/parada', paradascontroller.index);
routes.get('/parada/:id', paradascontroller.show);
routes.get('/paradaAll', paradascontroller.getAll);

export default routes;