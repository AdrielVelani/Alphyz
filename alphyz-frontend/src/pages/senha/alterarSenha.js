import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./alterarSenha.css";

export default function AlterarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const validarSenha = (senha) => {
    // Regras: mínimo 6 caracteres, incluindo maiúscula, minúscula, número e caractere especial
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(senha);
  };

  const confirmarAlteracao = async () => {
    if (!novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!validarSenha(novaSenha)) {
      setErro(
        "A senha deve ter no mínimo 6 caracteres, incluindo maiúscula, minúscula, número e caractere especial."
      );
      return;
    }

    setErro("");
    setMensagem("Atualizando senha...");

    try {
      const resposta = await fetch(
        "http://localhost:8080/recuperar/redefinir-senha",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, novaSenha }),
        }
      );

      const data = await resposta.json();

      if (!resposta.ok) {
        setErro(data.mensagem || "Token inválido ou expirado.");
        setMensagem("");
        return;
      }

      setMensagem("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErro("Erro ao redefinir senha. Tente novamente mais tarde.");
      setMensagem("");
    }
  };

  return (
    <div className="redefinir-container">
      <div className="redefinir-card">
        <h2>Redefinir senha</h2>
        <p>Digite sua nova senha e confirme abaixo.</p>

        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        {erro && <div className="error">{erro}</div>}
        {mensagem && <div className="success">{mensagem}</div>}

        <div className="redefinir-actions">
          <button className="btn primary" onClick={confirmarAlteracao}>
            Confirmar
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              setNovaSenha("");
              setConfirmarSenha("");
              setErro("");
              setMensagem("");
            }}
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
