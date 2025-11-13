import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./curadoria.css";

// Componente Tela de Curadoria
export default function Curadoria() {
  // Dados de exemplo para a tabela (baseado no protótipo)
  const dadosCuradoria = [
    { id: '0001', usuario: 'Usuário103', data: '01/02/2026', estado: 'Semi-novo', status: 'PENDENTE' },
    { id: '0002', usuario: 'Usuário503', data: '01/02/2026', estado: 'Novo', status: 'EM ANÁLISE' },
    // Adicionar mais dados conforme necessário
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'curadoria-status-pendente';
      case 'EM ANÁLISE':
        return 'curadoria-status-analise';
      default:
        return '';
    }
  };

  return (
    <div className="curadoria-container">
      {/* Cabeçalho da página (simulando o topo do protótipo) */}
      <div className="curadoria-header">
        <h1>Painel de Administrador</h1>
        <div className="curadoria-header-icons">
          <FaBell className="icon" aria-label="Notificações" />
          <FaUserCircle className="icon" aria-label="Perfil do Usuário" />
        </div>
      </div>

      <div className="curadoria-principal">
        {/* Menu Lateral (simulando o menu do protótipo) */}
        <div className="curadoria-menu">
          <button className="curadoria-btn" aria-label="Curadoria">Curadoria</button>
          <button className="curadoria-btn-sec" aria-label="Denúncias">Denúncias</button>
        </div>

        {/* Conteúdo da Curadoria */}
        <div className="curadoria-conteudo">
          <div className="curadoria-titulo-contador">
            <h2 className="curadoria-titulo">Curadoria</h2>
            <div className="curadoria-contador">
              *PENDENTES: 1<br />
              EM ANÁLISE: 1
            </div>
          </div>

          {/* Filtros */}
          <div className="curadoria-filtros">
            <label>
              Status:
              <select aria-label="Filtrar por Status">
                <option>Todos</option>
                <option>Pendente</option>
                <option>Em Análise</option>
                <option>Aprovado</option>
                <option>Rejeitado</option>
              </select>
            </label>
            <label>
              Data:
              <select aria-label="Filtrar por Data">
                <option>Mais recentes</option>
                <option>Mais antigos</option>
              </select>
            </label>
            <label>
              Estado:
              <select aria-label="Filtrar por Estado">
                <option>Todos</option>
                <option>Novo</option>
                <option>Semi-novo</option>
                <option>Usado</option>
              </select>
            </label>
          </div>

          {/* Tabela */}
          <div className="curadoria-tabela-wrapper">
            <table className="curadoria-tabela">
              <thead>
                <tr>
                  <th>ID da Publicação</th>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Estado</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosCuradoria.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.usuario}</td>
                    <td>{item.data}</td>
                    <td>{item.estado}</td>
                    <td>
                      <span className={getStatusClass(item.status)}>{item.status}</span>
                    </td>
                    <td>
                      <button className="curadoria-btn-revisar" aria-label={`Revisar publicação ${item.id}`}>
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
