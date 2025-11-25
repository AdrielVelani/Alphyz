import React, { useEffect, useState } from "react";
import "./shopping.css";
import SiteHeader from "../../components/SiteHeader";
import { API_BASE } from "../../services/api";

import fita from "../../assets/fita.png";

// carregar imagens automaticamente
const ctx = require.context("../../assets", false, /\.(png|jpe?g|webp)$/i);
const IMGS = {};
ctx.keys().forEach((k) => {
  const base = k.replace("./", "").replace(/\.(png|jpe?g|webp)$/i, "");
  IMGS[base] = ctx(k);
});
const img = (key) => IMGS[key] || null;

export default function Shopping() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  // buscar produtos do MongoDB
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${API_BASE}/produtos`);
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.log("Erro ao buscar produtos:", err);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []);

  // ---------------------------
  // FILTRAGEM DE BUSCA
  // ---------------------------
  const buscaLower = busca.toLowerCase();

  const produtosFiltrados = produtos.filter(
    (p) => p.nome && p.nome.toLowerCase().includes(buscaLower)
  );

  // scroll do carrossel
  const scrollLeft = (id) => {
    document.getElementById(id)?.scrollBy({ left: -240, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    document.getElementById(id)?.scrollBy({ left: 240, behavior: "smooth" });
  };

  // renderizar produtos
  const renderProdutos = (lista) =>
    lista.map((p) => (
      <div
        className="produto-card"
        key={p._id}
        onClick={() => (window.location.href = `/produto/${p._id}`)}
      >
        <div className="produto-imagem">
          {p.imagem ? (
            <img src={img(p.imagem)} alt={p.nome} />
          ) : (
            <div className="imagem-placeholder">Imagem</div>
          )}
        </div>

        <div className="produto-info">
          <div className="linha-1">
            <p className="produto-nome">{p.nome}</p>
            <span className="produto-tamanho">{p.tamanho || "M"}</span>
          </div>

          <div className="linha-2">
            <span className="produto-preco">{p.preco || "KLV$50"}</span>
            <button className="btn-icon btn-salvar">
              <img src={fita} alt="" />
            </button>
          </div>
        </div>
      </div>
    ));

  return (
    <>
      {/* HEADER envia texto da busca */}
      <SiteHeader onBuscaChange={(txt) => setBusca(txt)} />

      <div className="shopping-container">
        {/* LOADING */}
        {carregando && <p className="loading">Carregando produtos...</p>}

        {/* NENHUM ENCONTRADO */}
        {!carregando && produtosFiltrados.length === 0 && (
          <p className="nenhum">Nenhum produto encontrado.</p>
        )}

        {/* LISTA DE PRODUTOS */}
        {!carregando && produtosFiltrados.length > 0 && (
          <section className="secao">
            <div className="secao-header">
              <h2>
                {busca
                  ? `Resultados para: "${busca}"`
                  : "Produtos disponíveis"}
              </h2>
            </div>

            <div className="carousel-container">
              <button
                className="carousel-arrow left"
                onClick={() => scrollLeft("listaProdutos")}
              >
                &#10094;
              </button>

              <div className="carousel" id="listaProdutos">
                {renderProdutos(produtosFiltrados)}
              </div>

              <button
                className="carousel-arrow right"
                onClick={() => scrollRight("listaProdutos")}
              >
                &#10095;
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
