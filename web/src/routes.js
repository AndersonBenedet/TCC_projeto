import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import createParada from './pages/createParada';
import linha from './pages/linha';
import rastrear from './pages/rastrear';
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import Home from './pages/home';
import { isAuthenticated } from "./services/auth";


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <PrivateRoute path="/app" component={() => <h1>App</h1>} />
                <Route component={ Home } path='/' exact />
                <Route component={ createParada } path='/create-parada' exact />
                <Route component={ linha } path='/linha/:id/:parada' />
                <Route component={ rastrear } path='/rastrear/:id_linha/:id_paradaLinha_inicial/:id_paradaLinha_final' />
                <Route path="*" component={() => <h1>Page not found</h1>} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;