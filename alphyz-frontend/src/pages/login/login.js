
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../login/login.css";
import { postJSON } from "../../services/api";


import logoWhite from "../../assets/logobranco.png";   // logo branco (lado esquerdo)

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    await postJSON("/api/auth/login", { email: login, senha });
    alert("Login OK");
    window.location.href = '/shopping';
    // TODO: redirecionar se quiser
  } catch (e) {
    alert(typeof e?.message === "string" ? e.message : "Falha no login");
  }
}

  const enviarFormulario = (e) => {
    e.preventDefault();
    console.log("Login:", login, "Senha:", senha);
  };

  return (
    <div className="login-container">
      {/* COLUNA ESQUERDA: fundo escuro + logo centralizado */}
      <div className="login-left">
        <div className="left-brand">
          <img src={logoWhite} alt="alphyz" className="left-logo" />
        </div>
      </div>

      {/* COLUNA DIREITA: título no topo, formulário, links à esquerda e botão à direita */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-title">BEM-VINDO DE VOLTA!</h1>

          <label>Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {/* rodapé do formulário: links à esquerda, botão à direita */}
          <div className="form-footer">
            <div className="links">
              <a href="#">Esqueci a senha</a>
              <Link to="/cadastro">Ainda não sou cadastrado</Link>
            </div>
            <button type="submit" className="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
