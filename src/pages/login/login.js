import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

import {
  login as apiLogin,
  setToken,
  setUser,
  clearAuth,
  me as apiMe,
} from "../../services/api"; // ← removidos getUser/setUserId (causavam erro)
import logo from "../../assets/logobranco.png";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setErro("");
    setLoading(true);

    try {
      // seu backend: POST /autenticar/login { email, password }
      const data = await apiLogin({ email, password: senha });

      const token = data?.token || data?.accessToken;
      if (!token) throw new Error("Resposta sem token.");

      // salva token para as próximas chamadas
      setToken(token);

      // tenta pegar o usuário logado
      const userFromResponse = data?.usuario || data?.user || data?.userData;
      if (userFromResponse) {
        setUser(userFromResponse);
      } else {
        try {
          const me = await apiMe();
          if (me) setUser(me);
        } catch {
          /* ok */
        }
      }

      nav("/perfil", { replace: true });
    } catch (err) {
      console.error(err);
      setErro(err?.message || "Não foi possível fazer login.");
      clearAuth();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      {/* Coluna esquerda (branding) — mantém as classes do seu CSS */}
      <div className="login-left">
        <div className="left-brand">
          <a href="/shopping" aria-label="Voltar para a loja">
            <img src={logo} alt="alphyz" className="left-logo" />
          </a>
        </div>
      </div>

      {/* Coluna direita (form) — markup original preservado */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <h1 className="login-title">QUE BOM QUE VOCÊ VOLTOU!</h1>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />

          {erro && <p className="login-erro" role="alert">{erro}</p>}

          <div className="form-footer">
            <div className="links">
              <a href="#" onClick={(e) => e.preventDefault()}>Esqueci a senha</a>
              <Link to="/cadastro">Cadastre-se</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
