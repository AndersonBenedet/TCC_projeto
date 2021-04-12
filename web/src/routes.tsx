import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import createParada from './pages/createParada';

import Home from './pages/home';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={ Home } path='/' exact />
            <Route component={ createParada } path='/create-parada' exact />
        </BrowserRouter>
    );
}

export default Routes;