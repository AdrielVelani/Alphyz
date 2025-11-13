import React, { useState, useEffect } from "react";
import "./painelAdm.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Painel() {



  return (
      <>
    <div className="container">
      <aside className="menu-lateral">
        <img src={logo} alt="Logo Alphyz" className="logo" />
        <ul>
          <li>Conta</li>
          <li>Segurança</li>
          <li className="ativo">Painel de Administrador</li>
          <li><Link to = "/tema">Temas</Link></li>
          <li>Política de Privacidade</li>
          <li>Termos de Uso</li>
        </ul>
      </aside>

      <main className="conteudo">
        <h2>Painel de Administrador</h2>
        <p>Ao clicar no botão abaixo você sairá do Modo Usuário e irá para o Modo Administrador</p>
          <button className="btn-admin" >
        Ir para Painel de Administrador
        </button>
        
      </main>
    </div>

      <footer className="footer">
  <div className="footer-grid">
    <div className="foot-col">
      <a href="#" className="foot-link">Termos de uso</a>
      <a href="#" className="foot-link">Política de privacidade</a>
    </div>

    <div className="foot-col foot-center">
      <span className="foot-muted">Precisa entrar em contato conosco?</span>
      <a href="mailto:jjfloresmkt@gmail.com" className="foot-link">
        Email: jjfloresmkt@gmail.com
      </a>
    </div>

    <div className="foot-col foot-right">
      <a href="#" className="foot-link">FAQ</a>
      <a href="#" className="foot-link">Ajuda</a>
    </div>
  </div>
</footer>
    </>
  );
}