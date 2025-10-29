// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Shopping   from "./pages/shopping/shopping";
import LoginPage  from "./pages/login/login";
import Perfil     from "./pages/perfil/perfil";
import Home       from "./pages/home/home";       // ajuste o caminho se for diferente
import Cadastro   from "./pages/cadastro/cadastro"; // se não existir, crie um stub simples
import Produto   from "./pages/produto/produto";

const isAuth = () => {
  try { const t = localStorage.getItem("token"); return !!t && t !== "null" && t !== "undefined"; }
  catch { return false; }
};
const Protected = ({ children }) => (isAuth() ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shopping" replace />} />
      <Route path="/shopping" element={<Shopping />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/produto" element={<Produto />} />


      <Route path="/perfil" element={<Protected><Perfil /></Protected>} />
      <Route path="/perfil/:id" element={<Perfil />} />

      <Route path="*" element={<Navigate to="/shopping" replace />} />
    </Routes>
  );
}
