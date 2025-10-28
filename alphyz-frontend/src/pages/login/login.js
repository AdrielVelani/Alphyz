import { Link } from "react-router-dom";
import "../login/login.css";
// src/pages/login/login.js
import React, { useState } from 'react';
import { postJSON } from '../../services/api';

// Fallback: se houver um logo branco, troque a importação abaixo.
// import logoWhite from '../../assets/logo_white.png';
import logo from '../../assets/logobranco.png';
const logoWhite = logo;

export default function LoginPage() {
  const [email, setEmail]     = useState('');
  const [senha, setSenha]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const data = await postJSON('/autenticar/login', { email, password: senha });
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        if (data.usuario) localStorage.setItem('auth_user', JSON.stringify(data.usuario));
        window.location.href = '/shopping'; // mantém o fluxo
      } else {
        alert('Resposta sem token.');
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

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
          <h1 className="login-title">QUE BOM QUE VOCÊ VOLTOU!</h1>

          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label>Senha</label>
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />

          {/* rodapé do formulário: links à esquerda, botão à direita */}
          <div className="form-footer">
            <div className="links">
              <a href="#">Esqueci a senha</a>
              <Link to="/cadastro">Cadastre-se</Link>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
