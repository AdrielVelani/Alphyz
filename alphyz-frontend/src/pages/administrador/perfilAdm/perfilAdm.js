import React from "react";
import { FaBell, FaUserCircle, FaCog } from "react-icons/fa";
import "./perfilAdm.css";

// Componente Perfil do Administrador
export default function PerfilAdm() {
  return (
    <div className="perfilAdm-container">
      {/* Cabeçalho da página (simulando o topo do protótipo) */}
      <div className="perfilAdm-header">
        <h1>Painel de Administrador</h1>
        <div className="perfilAdm-header-icons">
          <FaBell className="icon" aria-label="Notificações" />
          <FaUserCircle className="icon" aria-label="Perfil do Usuário" />
        </div>
      </div>

      {/* Conteúdo principal do perfil */}
      <div className="perfilAdm-content">
        {/* Avatar */}
        <div className="perfilAdm-avatar" aria-label="Avatar do Administrador">
          {/* Pode ser substituído por uma imagem real */}
        </div>

        {/* Informações do Administrador */}
        <div className="perfilAdm-info">
          <h2>Teobaldo</h2>
          <p>Gerente de Projetos</p>
        </div>

        {/* Ações */}
        <div className="perfilAdm-actions">
          <button className="perfilAdm-btn-user" aria-label="Voltar ao Modo Usuário">
            Voltar ao Modo Usuário
          </button>
          <FaCog className="perfilAdm-icon-settings" aria-label="Configurações" />
        </div>
      </div>

      {/* Aqui viria o restante do conteúdo da página, se houver */}
    </div>
  );
}
