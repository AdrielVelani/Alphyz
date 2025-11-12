// src/components/SiteHeader.jsx
import React from "react";
import { FaSearch, FaSlidersH, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { getToken, clearAuth } from "../services/api";

import logo from "../assets/logo.png";
import pergunta from "../assets/pergunta.png";
import chat from "../assets/chat.png";

/**
 * Cabeçalho padrão do site (mantém as mesmas classes/HTML da sua UI).
 * - Logo clica -> /shopping
 * - "Sobre nós" -> /home
 * - Ícone usuário preto -> /perfil (quando logado)
 * - Botão SAIR (quando logado)
 * - LOGIN / CADASTRE-SE (quando deslogado)
 */
export default function SiteHeader() {
  const isAuth = !!getToken();

  const logout = () => {
    clearAuth();
    window.location.href = "/shopping";
  };

  return (
    <header className="header">
      {/* LOGO -> /shopping */}
      <div className="header-logo">
        <a href="/shopping" aria-label="Voltar para a loja">
          <img src={logo} alt="Alphyz" />
        </a>
      </div>

      {/* Busca central (mantido igual ao shopping/perfil) */}
      <div className="header-search">
        <FaSlidersH className="search-icon-left" />
        <div className="search-wrapper">
          <input type="text" placeholder="O que você está buscando?" className="search-input" />
          <FaSearch className="search-icon-right" />
        </div>
      </div>

      {/* Bloco direito */}
      <div className="header-right">
        <a href="/home" className="header-link">SOBRE NÓS</a>
        <img src={pergunta} className="header-icon" alt="ajuda" />
        <img src={chat} className="header-icon" alt="chat" />
        <FaShoppingCart className="header-icon" />

        {isAuth ? (
          <>
            <a
              href="/perfil"
              className="header-icon user"
              title="Meu perfil"
              aria-label="Meu perfil"
              style={{ color: "#000" }}
            >
              <FaUserCircle />
            </a>
            <button type="button" className="header-login" onClick={logout}>
              SAIR
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="header-login">LOGIN</a>
            <a className="header-btn" href="/cadastro">CADASTRE-SE</a>
          </>
        )}
      </div>
    </header>
  );
}
