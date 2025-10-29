import React, { useEffect, useState } from "react";
import "../cadastro/cadastro.css";
import logo from "../../assets/logo.png";
import logo_icon from "../../assets/logo_icon.png";
import { Link } from "react-router-dom";
import { API_BASE } from "../../services/api"; // ← trocado: usar API_BASE no POST

export default function Cadastro() {
  // Estado do formulário (visual inalterado)
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

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepErro, setCepErro] = useState("");

  // Fallback simples (se IBGE falhar)
  const cidadesFallback = {
    SP: ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
    RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda", "Campos dos Goytacazes"],
    MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem", "Uberaba"],
    ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Guarapari"],
  };

  // Helpers CEP/máscaras
  const onlyDigits = (v) => (v || "").replace(/\D/g, "");
  const formatCEP = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  // Carregar UFs
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingEstados(true);
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await res.json(); // [{id, sigla, nome}]
        if (!alive) return;
        setEstados(data);
      } catch {
        // Sudeste fallback
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
    return () => {
      alive = false;
    };
  }, []);

  // Carregar cidades ao trocar UF
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
        const data = await res.json(); // [{id, nome}]
        if (!alive) return;
        const nomes = data.map((c) => c.nome);
        setCidades(nomes);
        // se cidade atual não estiver na lista, limpa
        if (formData.cidade && !nomes.includes(formData.cidade)) {
          setFormData((p) => ({ ...p, cidade: "" }));
        }
      } catch {
        const nomes = cidadesFallback[uf] || [];
        setCidades(nomes);
      } finally {
        setLoadingCidades(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.estado]);

  // ViaCEP: ao completar 8 dígitos (ou blur), preenche rua/UF/cidade
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
      const uf = data.uf || "";
      const cidade = data.localidade || "";
      const rua = data.logradouro || "";

      setFormData((prev) => ({
        ...prev,
        rua,
        estado: uf,
        cidade,
      }));
      // efeito de estado recarrega a lista e mantemos a cidade se existir
    } catch {
      setCepErro("Não foi possível buscar o CEP. Tente novamente.");
    } finally {
      setLoadingCEP(false);
    }
  };

  // Mudanças de input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cep") {
      const digits = onlyDigits(value);
      setFormData((prev) => ({ ...prev, cep: digits }));
      if (digits.length === 8) lookupCEP(digits);
      else setCepErro("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // === SUBMISSÃO (mantendo visual; só o POST foi trocado) ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome.trim(),
      telefone: formData.telefone.trim(),
      cep: onlyDigits(formData.cep),
      rua: formData.rua.trim(),
      numero: formData.numero.trim(),
      complemento: formData.complemento.trim(), // opcional
      cpf: onlyDigits(formData.cpf),
      email: formData.email.trim(),
      senha: formData.senha,
      // estado e cidade são exibidos mas seu back atual salva rua/cep/…;
      // se precisar enviar, inclua:
      // estado: formData.estado,
      // cidade: formData.cidade,
    };

    const faltando = Object.entries(payload).find(([k, v]) => k !== "complemento" && !v);
    if (faltando) {
      alert(`Campo obrigatório faltando: ${faltando[0]}`);
      return;
    }
    if (!formData.termos || !formData.privacidade) {
      alert("Confirme os termos e a política de privacidade.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/autenticar/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Erro ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      if (data?.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.usuario || {}));
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "/"; // volta pro Login (como antes)
    } catch (err) {
      console.error(err);
      alert(err?.message || "Falha no cadastro");
    }
  };

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">
        <span>Faça parte da nossa comunidade</span>
        <img src={logo_icon} alt="alphyz" className="cadastro-title__logo" />
        <span></span>
      </h2>

      <form onSubmit={handleSubmit} className="cadastro-form">
        {/* Coluna ESQUERDA */}
        <div className="col">
          <label>Nome completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

          <label>Telefone</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />

          {/* CEP logo abaixo do telefone */}
          <label>CEP</label>
          <input
            type="text"
            name="cep"
            value={formatCEP(formData.cep)}
            onChange={handleChange}
            onBlur={() => {
              const d = onlyDigits(formData.cep);
              if (d.length === 8) lookupCEP(d);
            }}
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
          <input
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
          />
        </div>

        {/* Coluna DIREITA */}
        <div className="col">
          <div className="field-row">
            <div className="field">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={loadingEstados}
              >
                <option value="">{loadingEstados ? "Carregando..." : "Selecione uma opção"}</option>
                {estados.map((uf) => (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Cidade</label>
              <select
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={!formData.estado || loadingCidades}
              >
                <option value="">
                  {!formData.estado
                    ? "Selecione um estado"
                    : loadingCidades
                    ? "Carregando..."
                    : "Selecione uma opção"}
                </option>
                {cidades.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />

          <label>E-mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Senha</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />

          <label className="checkbox">
            <input
              type="checkbox"
              name="termos"
              checked={formData.termos}
              onChange={handleChange}
            />
            <span>Confirmo que li e concordo com os termos de uso</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="privacidade"
              checked={formData.privacidade}
              onChange={handleChange}
            />
            <span>Confirmo que li e estou ciente sobre a Política de privacidade</span>
          </label>

          <button type="submit" className="btn-enviar">Enviar</button>

          <p className="voltar-login">
            <Link to="/login">Já possuo conta (fazer login)</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
