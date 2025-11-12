// RecuperacaoSenha.jsx
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './senha.css';

export default function RecuperacaoSenha({ onVoltarLogin, onEnviar }) {
  return (
    <div className="recuperacao-container">
      <main className="card" aria-labelledby="title">
        <div className="brand">
          <div>
            <h1 id="title">Recuperar senha</h1>
            <p className="lead">
              Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@exemplo.com"
            />
            <div className="error"></div>
          </div>

          <div className="actions">
            <button
              type="submit"
              className="btn primary"
              onClick={onEnviar || (() => alert('Função de envio ainda não configurada'))}
            >
              Enviar link
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => alert('Cancelado')}
            >
              Cancelar
            </button>
          </div>

          <p className="hint">
            Se não receber o e-mail, verifique a pasta de spam ou aguarde alguns minutos.
          </p>
        </form>

        <p className="footer-text">
            <Link to="/login">Voltar ao login</Link>
        </p>
      </main>
    </div>
  );
}
