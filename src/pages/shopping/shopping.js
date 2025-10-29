import React from "react";
import "./shopping.css";
import { FaShoppingCart, FaSlidersH, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import pergunta from "../../assets/pergunta.png";
import chat from "../../assets/chat.png";
import fita from "../../assets/fita.png";
import { FaUserCircle } from "react-icons/fa";
import { getToken, clearAuth } from "../../services/api";
import SiteHeader from "../../components/SiteHeader"; // ajuste o caminho se necessário


// Carrega todas as imagens da pasta /src/assets (png/jpg/jpeg/webp)
const ctx = require.context("../../assets", false, /\.(png|jpe?g|webp)$/i);
const IMGS = {};
ctx.keys().forEach((k) => {
  const base = k.replace("./", "").replace(/\.(png|jpe?g|webp)$/i, "");
  IMGS[base] = ctx(k);
});
const img = (key) => IMGS[key] || null;

export default function Shopping() {
  // Imagens reais do /src/assets (use os nomes de arquivo sem extensão)
  const recomendados = [
    { nome: "Camiseta Branca",  preco: "KLV$70",  tamanho: "M", img: img("blusarosa") },
    { nome: "Camiseta Preta",   preco: "KLV$50",  tamanho: "M", img: img("blusapreta") },
    { nome: "Casaco Cinza Chumbo", preco: "KLV$150", tamanho: "M", img: img("blusafloral") },
    { nome: "Casaco Cinza Claro",  preco: "KLV$120", tamanho: "M", img: img("blusacinza") },
    { nome: "Camisa Flanelada Azul", preco: "KLV$120", tamanho: "M", img: img("bermudarosa") },
  ];

  const primavera = [
    { nome: "Camiseta Preta",  preco: "KLV$50",  tamanho: "M", img: img("regataamarela") },
    { nome: "Camiseta Preta",  preco: "KLV$50",  tamanho: "M", img: img("vestidopreto") },
    { nome: "Casaco Cinza Chumbo", preco: "KLV$150", tamanho: "M", img: img("blusacinza") },
    { nome: "Casaco Cinza Claro",  preco: "KLV$120", tamanho: "M", img: img("blusafloral") },
    { nome: "Camisa Flanelada Azul", preco: "KLV$120", tamanho: "M", img: img("blusarosa") },
  ];

  const destaque = [
    { nome: "Camiseta Branca",  preco: "KLV$70",  tamanho: "M", img: img("bermudarosa") },
    { nome: "Camiseta Preta",   preco: "KLV$50",  tamanho: "M", img: img("vestidopreto") },
    { nome: "Casaco Cinza Chumbo", preco: "KLV$150", tamanho: "M", img: img("blusacinza") },
    { nome: "Casaco Cinza Claro",  preco: "KLV$120", tamanho: "M", img: img("regataamarela") },
  ];

  const renderProdutos = (produtos) =>
    produtos.map((p, i) => (
      <div className="produto-card" key={i}>
        <div className="produto-imagem">
          {p.img ? <img src={p.img} alt={p.nome} /> : <div className="imagem-placeholder">Imagem</div>}
        </div>

        <div className="produto-info">
          <div className="linha-1">
            <p className="produto-nome">{p.nome}</p>
            <span className="produto-tamanho">{p.tamanho}</span>
          </div>

          <div className="linha-2">
            <span className="produto-preco">{p.preco}</span>
            <button className="btn-icon btn-salvar" aria-label="Salvar">
              <img src={fita} alt="" />
            </button>
          </div>
        </div>
      </div>
    ));

  const scrollLeft = (id) => {
    const container = document.getElementById(id);
    container && container.scrollBy({ left: -240, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    const container = document.getElementById(id);
    container && container.scrollBy({ left: 240, behavior: "smooth" });
  };

  const Secao = ({ id, titulo, produtos, classe = "" }) => (
    <section className={`secao ${classe}`}>
      <div className="secao-header">
        <h2>{titulo}</h2>
        <a href="#" className="ver-mais">Ver mais</a>
      </div>

      <div className="carousel-container">
        <button className="carousel-arrow left" onClick={() => scrollLeft(id)} aria-label="anterior">
          &#10094;
        </button>
        <div className="carousel" id={id}>{renderProdutos(produtos)}</div>
        <button className="carousel-arrow right" onClick={() => scrollRight(id)} aria-label="próximo">
          &#10095;
        </button>
      </div>
    </section>
  );

  return (
    <>
      <SiteHeader />

      {/* ---------- CONTEÚDO ---------- */}
      <div className="shopping-container">
        <Secao id="recomendados" titulo="RECOMENDADOS" produtos={recomendados} />
        <Secao id="primavera" titulo="PARA PRIMAVERA" produtos={primavera} classe="secao--primavera" />
        <Secao id="destaque" titulo="DESTAQUE DO DIA" produtos={destaque} />
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
  <div className="footer-grid">
    <div className="foot-col">
      <a href="#" className="foot-link">Termos de uso</a>
      <a href="#" className="foot-link">Política de privacidade</a>
    </div>

    <div className="foot-col foot-center">
      <span className="foot-muted">Precisa entrar em contato conosco?</span>
      <a href="mailto:jjfloresmkt@gmail.com" className="foot-link">
        Email: jjfloresmkt@gmail.com
      </a>
    </div>

    <div className="foot-col foot-right">
      <a href="#" className="foot-link">FAQ</a>
      <a href="#" className="foot-link">Ajuda</a>
    </div>
  </div>
</footer>
    </>
  );
}
