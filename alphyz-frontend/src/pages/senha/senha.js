import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './senha.css';

export default function RecuperacaoSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      // ✅ Corrigido o endpoint:
      const resposta = await fetch('http://localhost:8080/recuperar/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Como o backend retorna apenas uma string (não JSON),
      // usamos `text()` em vez de `json()`.
      const data = await resposta.text();

      if (!resposta.ok) {
        setErro(data || 'E-mail não encontrado.');
        return;
      }

      // Verifica se o retorno do backend indica sucesso
      if (data.toLowerCase().includes('sucesso')) {
        setMensagem('Link de redefinição enviado para o seu e-mail!');
        setEmail('');
      } else {
        setErro(data);
      }
    } catch (error) {
      setErro('Erro ao enviar solicitação. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="recuperacao-container">
      <main className="card" aria-labelledby="title">
        <div className="brand">
          <h1 id="title">Recuperar senha</h1>
          <p className="lead">
            Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleEnviar}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erro && <p className="erro-texto">{erro}</p>}
            {mensagem && <p className="sucesso-texto">{mensagem}</p>}
          </div>

          <div className="actions">
            <button type="submit" className="btn primary">Enviar link</button>
            <Link to="/login" className="btn ghost">Cancelar</Link>
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
