import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Form, Container } from "./styles";
import api from "../../services/api";

import { login } from "../../services/auth";

class SignIn extends Component {
  state = {
    password: "",
    error: ""
  };

  handleSignIn = async e => {
    e.preventDefault();
    const { usuario, password } = this.state;
    if ( !usuario) {
      this.setState({ error: "Preencha o usuario para continuar!" });
    } else {
      if (!password) {
        this.setState({ error: "Preencha senha para continuar!" });
      } else {
        try {
          const response = await api.post("/sessions", { usuario, password });
          login(response.data.login);
          this.props.history.push("/Home");
        } catch (err) {
          this.setState({
            error:
              "Houve um problema com o login, verifique suas credenciais."
          });
        }
      }
    }
  };

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSignIn}>
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="text"
            placeholder="Usuario"
            onChange={e => this.setState({ usuario: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button type="submit">Entrar</button>
          <hr />
          <Link to="/signup">Criar conta</Link>
        </Form>
      </Container>
    );
  }
}

export default withRouter(SignIn);