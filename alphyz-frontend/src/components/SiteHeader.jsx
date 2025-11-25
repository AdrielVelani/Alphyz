// src/components/SiteHeader.jsx
import React from "react";
import { FaSearch, FaSlidersH, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { getToken, clearAuth } from "../services/api";

import logo from "../assets/logo.png";
import pergunta from "../assets/pergunta.png";
import chat from "../assets/chat.png";

export default function SiteHeader({ onBuscaChange }) {
  const isAuth = !!getToken();

  const logout = () => {
    clearAuth();
    window.location.href = "/shopping";
  };

  return (
    <header className="header">
      <div className="header-logo">
        <a href="/shopping">
          <img src={logo} alt="Alphyz" />
        </a>
      </div>

      {/* BUSCA FUNCIONANDO */}
      <div className="header-search">
        <FaSlidersH className="search-icon-left" />

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="O que você está buscando?"
            className="search-input"
            onChange={(e) => onBuscaChange && onBuscaChange(e.target.value)}
          />
          <FaSearch className="search-icon-right" />
        </div>
      </div>

      <div className="header-right">
        <a href="/home" className="header-link">SOBRE NÓS</a>
        <img src={pergunta} className="header-icon" alt="ajuda" />
        <img src={chat} className="header-icon" alt="chat" />
        <FaShoppingCart className="header-icon" />

        {isAuth ? (
          <>
            <a href="/perfil" className="header-icon user" style={{ color: "#000" }}>
              <FaUserCircle />
            </a>
            <button className="header-btn" onClick={logout}>SAIR</button>
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
