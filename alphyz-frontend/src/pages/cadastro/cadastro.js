import React, { useEffect, useState } from "react";
import "../cadastro/cadastro.css";
import logo from "../../assets/logo.png";
import logo_icon from "../../assets/logo_icon.png";
import { Link } from "react-router-dom";
import { API_BASE } from "../../services/api"; // ← trocado: usar API_BASE no POST


export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    estado: "",
    cidade: "",
    cpf: "",
    email: "",
    senha: "",
    termos: false,
    privacidade: false,
  });

  const SENHA_MIN = 6;
  const SENHA_MAX = 20;
  const CPF_LENGTH = 11;
  const TAL_MIN = 10;
  const TAL_MAX = 15;

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepErro, setCepErro] = useState("");
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState("");

  const cidadesFallback = {
    SP: ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
    RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda", "Campos dos Goytacazes"],
    MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem", "Uberaba"],
    ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Guarapari"],
  };

  const onlyDigits = (v) => (v || "").replace(/\D/g, "");
  const formatCEP = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  const validarSenha = (senha) => {
    const erros = [];
    if (senha.length < SENHA_MIN) erros.push(`Mínimo de ${SENHA_MIN} caracteres`);
    if (senha.length > SENHA_MAX) erros.push(`Máximo de ${SENHA_MAX} caracteres`);
    if (!/[a-z]/.test(senha)) erros.push("Inclua uma letra minúscula");
    if (!/[A-Z]/.test(senha)) erros.push("Inclua uma letra maiúscula");
    if (!/[0-9]/.test(senha)) erros.push("Inclua um número");
    if (!/[!@#$%^&*()_\-+=<>?/{}[\]~]/.test(senha))
      erros.push("Inclua um caractere especial");
    return erros;
  };

  // ---------------- USE EFFECTS ----------------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingEstados(true);
        const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        const data = await res.json();
        if (!alive) return;
        setEstados(data);
      } catch {
        setEstados([
          { sigla: "ES", nome: "Espírito Santo" },
          { sigla: "MG", nome: "Minas Gerais" },
          { sigla: "RJ", nome: "Rio de Janeiro" },
          { sigla: "SP", nome: "São Paulo" },
        ]);
      } finally {
        setLoadingEstados(false);
      }
    })();
    return () => (alive = false);
  }, []);

  useEffect(() => {
    const uf = formData.estado;
    if (!uf) {
      setCidades([]);
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoadingCidades(true);
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
        );
        const data = await res.json();
        if (!alive) return;
        const nomes = data.map((c) => c.nome);
        setCidades(nomes);
        if (formData.cidade && !nomes.includes(formData.cidade)) {
          setFormData((p) => ({ ...p, cidade: "" }));
        }
      } catch {
        setCidades(cidadesFallback[uf] || []);
      } finally {
        setLoadingCidades(false);
      }
    })();
    return () => (alive = false);
  }, [formData.estado]);

  // ---------------- VIA CEP ----------------
  const lookupCEP = async (cepDigits) => {
    if (cepDigits.length !== 8) return;
    try {
      setLoadingCEP(true);
      setCepErro("");
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setCepErro("CEP não encontrado.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        estado: data.uf || "",
        cidade: data.localidade || "",
      }));
    } catch {
      setCepErro("Erro ao buscar CEP.");
    } finally {
      setLoadingCEP(false);
    }
  };

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cep") {
      const digits = onlyDigits(value);
      setFormData((p) => ({ ...p, cep: digits }));
      if (digits.length === 8) lookupCEP(digits);
      else setCepErro("");
      return;
    }

    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErros({});
    setSucesso("");

    // CPF
    if (onlyDigits(formData.cpf).length !== CPF_LENGTH) {
      setErros((p) => ({ ...p, cpf: "CPF deve ter 11 dígitos" }));
      return;
    }

    // Telefone
    const tel = onlyDigits(formData.telefone);
    if (tel.length < TAL_MIN || tel.length > TAL_MAX) {
      setErros((p) => ({ ...p, telefone: "Telefone deve ter entre 10 e 15 dígitos" }));
      return;
    }

    // Senha
    const errosSenha = validarSenha(formData.senha);
    if (errosSenha.length > 0) {
      setErros((p) => ({ ...p, senha: errosSenha.join(", ") }));
      return;
    }

    // Campos obrigatórios
    const payload = {
      nome: formData.nome.trim(),
      telefone: formData.telefone.trim(),
      cep: onlyDigits(formData.cep),
      rua: formData.rua.trim(),
      numero: formData.numero.trim(),
      complemento: formData.complemento.trim(),
      cpf: onlyDigits(formData.cpf),
      email: formData.email.trim(),
      senha: formData.senha,
    };

    const faltando = Object.entries(payload).find(([k, v]) => k !== "complemento" && !v);
    if (faltando) {
      setErros((p) => ({ ...p, geral: `Preencha o campo: ${faltando[0]}` }));
      return;
    }

    if (!formData.termos || !formData.privacidade) {
      setErros((p) => ({ ...p, geral: "Confirme os termos e privacidade." }));
      return;
    }

    // Envio
    try {
      const res = await fetch(`${API_BASE}/autenticar/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro");

      //  SUCESSO → mensagem verde
      setSucesso("Cadastro realizado com sucesso!");

      // limpa campos
      setFormData({
        nome: "",
        telefone: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        estado: "",
        cidade: "",
        cpf: "",
        email: "",
        senha: "",
        termos: false,
        privacidade: false,
      });

    } catch (err) {
      setErros((p) => ({ ...p, geral: "Erro ao cadastrar, tente novamente." }));
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">
        <span>Faça parte da nossa comunidade!</span>
        <img src={logo_icon} alt="alphyz" className="cadastro-title__logo" />
      </h2>


      {erros.geral && <small className="error">{erros.geral}</small>}

      <form onSubmit={handleSubmit} className="cadastro-form">
        {/* ESQUERDA */}
        <div className="col">
          <label>Nome completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

          <label>Telefone</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
          {erros.telefone && <small className="error">{erros.telefone}</small>}

          <label>CEP</label>
          <input
            type="text"
            name="cep"
            value={formatCEP(formData.cep)}
            onChange={handleChange}
            onBlur={() => lookupCEP(onlyDigits(formData.cep))}
            placeholder="00000-000"
          />
          <small className={`hint ${cepErro ? "error" : ""}`}>
            {loadingCEP ? "Buscando CEP..." : cepErro || "Preencha para autocompletar endereço"}
          </small>

          <label>Rua</label>
          <input type="text" name="rua" value={formData.rua} onChange={handleChange} />

          <label>Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />

          <label>Complemento (Opcional)</label>
          <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
        </div>

        {/* DIREITA */}
        <div className="col">
          <label>Estado</label>
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="">Selecione</option>
            {estados.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
            ))}
          </select>

          <label>Cidade</label>
          <select name="cidade" value={formData.cidade} onChange={handleChange}>
            <option value="">Selecione</option>
            {cidades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label>CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
          {erros.cpf && <small className="error">{erros.cpf}</small>}

          <label>E-mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Senha</label>
          <input
            type="password"
            name="senha"
            maxLength={20}
            value={formData.senha}
            onChange={handleChange}
          />
          {erros.senha && <small className="error">{erros.senha}</small>}

          <label className="checkbox">
            <input type="checkbox" name="termos" checked={formData.termos} onChange={handleChange} />
            <span>Confirmo que li e concordo com os termos de uso</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="privacidade"
              checked={formData.privacidade}
              onChange={handleChange}
            />
            <span>Confirmo que li e estou ciente da Política de privacidade</span>
          </label>

          <button type="submit" className="btn-enviar">Enviar</button>
            {sucesso && <p className="sucesso">{sucesso}</p>}


          <p className="voltar-login">
            <Link to="/login">Já possuo conta (fazer login)</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
