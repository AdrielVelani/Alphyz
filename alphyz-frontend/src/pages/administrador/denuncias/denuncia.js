import React, { useState } from "react";
import "./denuncias.css";

export default function PainelDenuncias() {
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Conteúdo");

  const listaDenuncias = [
    {
      idPub: "0001",
      usuarioAlvo: "Usuário103",
      tipo: "Conteúdo",
      detalhe: "KSAJIOJ DOEJ KKJ BJDDB WEH BDJ NAJNJ DJAD...",
      situacao: "PENDENTE",
    },
    {
      idPub: "0002",
      usuarioAlvo: "Usuário503",
      tipo: "Conteúdo",
      detalhe: "KSAJIOJ DOEJ KKJ BJDDB WEH BDJ NAJNJ DJAD...",
      situacao: "EM ANÁLISE",
    },
    {
      idPub: "0003",
      usuarioAlvo: "Usuário624",
      tipo: "Conteúdo",
      detalhe: "KSAJIOJ DOEJ KKJ BJDDB WEH BDJ NAJNJ DJAD...",
      situacao: "RESOLVIDO",
    },
  ];

  const denunciasFiltradas = listaDenuncias.filter((d) => {
    const combinaStatus =
      filtroStatus === "Todos" || d.situacao === filtroStatus;
    const combinaCategoria =
      filtroCategoria === "Conteúdo" || d.tipo === filtroCategoria;
    return combinaStatus && combinaCategoria;
  });

  return (
    <div className="painelDenuncias-wrapper">
      <header className="painelDenuncias-topo">
        <h2>Painel de Administrador</h2>
        <div className="painelDenuncias-icones">
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      <main className="painelDenuncias-principal">
        <aside className="painelDenuncias-menu">
          <button className="painelDenuncias-btnSec">Curadoria</button>
          <button className="painelDenuncias-btnPri">Denúncias</button>
        </aside>

        <section className="painelDenuncias-corpo">
          <h1>Denúncias</h1>

          <div className="painelDenuncias-contador">
            <p>*PENDENTES: 1</p>
            <p>EM ANÁLISE: 1</p>
            <p>RESOLVIDAS: 1</p>
          </div>

          <div className="painelDenuncias-filtros">
            <label>
              Status:
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option>Todos</option>
                <option>PENDENTE</option>
                <option>EM ANÁLISE</option>
                <option>RESOLVIDO</option>
              </select>
            </label>

            <label>
              Categoria:
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option>Conteúdo</option>
              </select>
            </label>
          </div>

          <div className="painelDenuncias-tabela">
            <table>
              <thead>
                <tr>
                  <th>ID da Publicação</th>
                  <th>Usuário denunciado</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {denunciasFiltradas.map((d) => (
                  <tr key={d.idPub}>
                    <td>{d.idPub}</td>
                    <td>{d.usuarioAlvo}</td>
                    <td>{d.tipo}</td>
                    <td>{d.detalhe}</td>
                    <td
                      className={`painelDenuncias-status ${
                        d.situacao === "PENDENTE"
                          ? "painelDenuncias-pendente"
                          : d.situacao === "EM ANÁLISE"
                          ? "painelDenuncias-analise"
                          : "painelDenuncias-resolvido"
                      }`}
                    >
                      {d.situacao}
                    </td>
                    <td>
                      {d.situacao !== "RESOLVIDO" ? (
                        <button className="painelDenuncias-btnRevisar">
                          Revisar
                        </button>
                      ) : (
                        <>
                          <button className="painelDenuncias-btnArquivar">
                            Arquivar
                          </button>
                          <button className="painelDenuncias-btnExcluir">
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}