import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './senha.css';

export default function RecuperacaoSenha({ onVoltarLogin, onEnviar }) {
  const [showPopup, setShowPopup] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleEnviar = (e) => {
    e.preventDefault();
    // Exibe pop-up para redefinir senha
    setShowPopup(true);
  };

  const fecharPopup = () => {
    setShowPopup(false);
    setNovaSenha('');
    setConfirmarSenha('');
    setErro('');
  };

  const confirmarAlteracao = () => {
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setErro('');
    setShowPopup(false);
    alert('Senha redefinida com sucesso!');
    if (onEnviar) onEnviar();
  };

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

        <form onSubmit={handleEnviar}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@exemplo.com"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn primary">
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

      {/* Pop-up de confirmação de senha */}
      {showPopup && (
        <div className="popup-overlay" onClick={fecharPopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>Redefinir senha</h2>
            <p>Digite sua nova senha e confirme abaixo.</p>

            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            {erro && <div className="error">{erro}</div>}

            <div className="popup-actions">
              <button className="btn primary" onClick={confirmarAlteracao}>
                Confirmar
              </button>
              <button className="btn ghost" onClick={fecharPopup}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}