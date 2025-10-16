
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.js";
import Cadastro from "./pages/cadastro/cadastro.js";
import Home from "./pages/home/home.js";
import Shopping from "./pages/shopping/shopping.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
       <Route path="/cadastro" element={<Cadastro />} />
       <Route path="/home" element={<Home />} />
             <Route path="/shopping" element={<Shopping />} />
      </Routes>
    </BrowserRouter>
  );
}

