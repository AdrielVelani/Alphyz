import React, { useEffect, useState } from "react";
import "../cadastro/cadastro.css";
import logo from "../../assets/logo.png";
import logo_icon from "../../assets/logo_icon.png";
import { Link } from "react-router-dom";
import { API_BASE } from "../../services/api";

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
    confirmarSenha: "",
    termos: false,
    privacidade: false,
  });

  const SENHA_MIN = 6;
  const SENHA_MAX = 20;
  const CPF_LENGTH = 11;
  const TAL_MIN = 10;
  const TAL_MAX = 15;
  const [forcaSenha, setForcaSenha] = useState("");
  const [corForca, setCorForca] = useState("");
  const [requisitosSenha, setRequisitosSenha] = useState([]);



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
  if (!/[!@#$%^&*()_\-+=<>?/{}[\]~]/.test(senha)) erros.push("Inclua um caractere especial");

  return erros;
};


  const verificarForcaSenha = (senha) => {
  const erros = validarSenha(senha);
  setRequisitosSenha(erros);

  let score = 0;

  if (senha.length >= 6) score++;
  if (senha.length >= 10) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[a-z]/.test(senha)) score++;
  if (/\d/.test(senha)) score++;
  if (/[!@#$%^&*()_\-+=<>?/{}[\]~]/.test(senha)) score++;

  if (score <= 2) {
    setForcaSenha("Fraca");
    setCorForca("#ff4d4d");
  } else if (score <= 4) {
    setForcaSenha("Média");
    setCorForca("#ffa500");
  } else {
    setForcaSenha("Forte");
    setCorForca("#28a745");
  }
};



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

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "cep") {
    const digits = onlyDigits(value);
    setFormData((p) => ({ ...p, cep: digits }));
    if (digits.length === 8) lookupCEP(digits);
    else setCepErro("");
    return;
  }

  if (name === "senha") {
    verificarForcaSenha(value);
  }

  setFormData((p) => ({
    ...p,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErros = {};
    setSucesso("");

    if (!formData.nome.trim()) newErros.nome = "Preencha o nome";

    const tel = onlyDigits(formData.telefone);
    if (tel.length < TAL_MIN || tel.length > TAL_MAX) {
      newErros.telefone = "Telefone deve ter entre 10 e 15 dígitos";
    }

    if (onlyDigits(formData.cpf).length !== CPF_LENGTH) {
      newErros.cpf = "CPF deve ter 11 dígitos";
    }

    const senhaErros = validarSenha(formData.senha);
    if (senhaErros.length > 0) newErros.senha = senhaErros.join(", ");
    if (formData.confirmarSenha !== formData.senha) {
  newErros.confirmarSenha = "As senhas não coincidem";
}


    if (!formData.email.trim()) newErros.email = "Informe o email";
    if (!formData.rua.trim()) newErros.rua = "Informe a rua";
    if (!formData.numero.trim()) newErros.numero = "Informe o número";
    if (!formData.estado) newErros.estado = "Selecione um estado";
    if (!formData.cidade) newErros.cidade = "Selecione uma cidade";
    if (!formData.cep) newErros.cep = "Informe o CEP";

    if (!formData.termos || !formData.privacidade) {
      newErros.geral = "Confirme os termos e privacidade";
    }

    setErros(newErros);

    if (Object.keys(newErros).length > 0) return;

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

   try {
  const res = await fetch(`${API_BASE}/autenticar/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  // ❌ Se deu erro no backend
  if (!res.ok) {
    const newErrosBackend = {};

    const msg = JSON.stringify(data).toLowerCase();

    if (msg.includes("cpf")) {
      newErrosBackend.cpf = "CPF já está cadastrado";
    }
    if (msg.includes("email")) {
      newErrosBackend.email = "E-mail já está cadastrado";
    }
    if (msg.includes("telefone") || msg.includes("tel")) {
      newErrosBackend.telefone = "Telefone já está cadastrado";
    }

    // fallback caso não encontre nada específico
    if (Object.keys(newErrosBackend).length === 0) {
      newErrosBackend.geral = data?.mensagem || "Erro ao cadastrar. Tente novamente.";
    }

    setErros(newErrosBackend);
    return;
  }

  // ✅ SUCESSO
  setSucesso("Cadastro realizado com sucesso!");
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
    confirmarSenha: "",
    termos: false,
    privacidade: false,
  });

} catch (error) {
  setErros({ geral: "Erro ao conectar ao servidor." });
}

  };

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">
        <span>Faça parte da nossa comunidade!</span>
        <img src={logo_icon} alt="alphyz" className="cadastro-title__logo" />
      </h2>

      

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="col">
          <label>Nome completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
          {erros.nome && <small className="error">{erros.nome}</small>}

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
          {erros.cep && <small className="error">{erros.cep}</small>}

          <label>Rua</label>
          <input type="text" name="rua" value={formData.rua} onChange={handleChange} />
          {erros.rua && <small className="error">{erros.rua}</small>}

          <label>Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
          {erros.numero && <small className="error">{erros.numero}</small>}

          <label>Complemento (Opcional)</label>
          <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
        </div>

        <div className="col">
          <label>Estado</label>
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="">Selecione</option>
            {estados.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
            ))}
          </select>
          {erros.estado && <small className="error">{erros.estado}</small>}

          <label>Cidade</label>
          <select name="cidade" value={formData.cidade} onChange={handleChange}>
            <option value="">Selecione</option>
            {cidades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {erros.cidade && <small className="error">{erros.cidade}</small>}

          <label>CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
          {erros.cpf && <small className="error">{erros.cpf}</small>}

          <label>E-mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {erros.email && <small className="error">{erros.email}</small>}

         <label>Senha</label>
<input
  type="password"
  name="senha"
  maxLength={20}
  value={formData.senha}
  onChange={handleChange}
/>

{/* Indicador visual da força */}
{formData.senha && (
  <>
    <div className="forca-senha">
      <div
        className="barra-forca"
        style={{ backgroundColor: corForca }}
      ></div>
      <small style={{ color: corForca }}>
        Força da senha: {forcaSenha}
      </small>
    </div>

    {/* Requisitos da senha em tempo real */}
    <ul className="requisitos-senha">
      {requisitosSenha.map((req, index) => (
        <li key={index}>{req}</li>
      ))}
    </ul>
  </>
)}

{erros.senha && <small className="error">{erros.senha}</small>}
<label>Confirmar Senha</label>
<input
  type="password"
  name="confirmarSenha"
  maxLength={20}
  value={formData.confirmarSenha}
  onChange={handleChange}
/>

{erros.confirmarSenha && (
  <small className="error">{erros.confirmarSenha}</small>
)}


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
          {erros.geral && <small className="error">{erros.geral}</small>}

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

