import React, { useState, useEffect } from "react";
import "./tema.css";
import logo from "../../assets/logo.png";

export default function TemaPreferencia() {
  const [tema, setTema] = useState(localStorage.getItem("tema") || "claro");

  // Aplica o tema e salva no localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  return (
    <div className="tema-container">
      <aside className="menu-lateral">
        <img src={logo} alt="Logo Alphyz" className="logo" />
        <ul>
          <li>Conta</li>
          <li>Segurança</li>
          <li>Painel de Administrador</li>
          <li className="ativo">Temas</li>
          <li>Política de Privacidade</li>
          <li>Termos de Uso</li>
        </ul>
      </aside>

      <main className="conteudo-tema">
        <h2>TEMAS</h2>
        <div className="form-tema">
          <label htmlFor="tema-select">Qual sua preferência de tema?</label>
          <select
            id="tema-select"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          >
            <option value="claro">Claro </option>
            <option value="escuro">Escuro </option>
          </select>
        </div>
      </main>
    </div>
  );
}