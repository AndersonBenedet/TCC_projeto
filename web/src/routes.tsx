import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import createParada from './pages/createParada';
import linha from './pages/linha';

import Home from './pages/home';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={ Home } path='/' exact />
            <Route component={ createParada } path='/create-parada' exact />
            <Route component={ linha } path='/linha/:id/:parada' />
        </BrowserRouter>
    );
}

export default Routes;