import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Form, Container } from "./styles";
import api from "../../services/api";

class SignUp extends Component {
  state = {
    nome: "",
    cpf: "",
    usuario: "",
    senha: "",
    error: "",
    aberto: false,
  };

  open = {
    aberto: false
  };
  
  handleSignUp = async e => {
    e.preventDefault();
    const { usuario, senha, nome, cpf } = this.state;
    if (!usuario || !senha || !nome || !cpf ) {
      this.setState({ error: "Preencha todos os dados para se cadastrar" });
    } else {
      try {
        var response = await api.post("/sessions", { usuario, password: senha });
        if (!response.data.login){
          this.setState({ error: "Usuario e senha não encontrados." });
          return
        };

        response = await api.post("/criar-motorista", { nome, cpf, usuario, senha });

        alert('cadastrado com sucesso')
        this.props.history.push("/Home");

      } catch (err) {
        console.log(err);
        this.setState({ error: "Ocorreu um erro ao registrar sua conta." });
      }
    }
  };

  render() {
    return (
        <Container>
          <Form onSubmit={this.handleSignUp}>
            {this.state.error && <p>{this.state.error}</p>}
            <input
              type="text"
              placeholder="Nome"
              onChange={e => this.setState({ nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="CPF"
              onChange={e => this.setState({ cpf: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nome de usuário"
              onChange={e => this.setState({ usuario: e.target.value })}
            />
            <input
              type="password"
              placeholder="Senha"
              onChange={e => this.setState({ senha: e.target.value })}
            />
            <button type="submit">Cadastrar</button>
            <hr />
            <Link to="/">Cadastrar motorista</Link>
          </Form>
        </Container>
    );
  }
}

export default withRouter(SignUp);