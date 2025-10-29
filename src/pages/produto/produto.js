import React, { useState, useEffect } from "react";
import "./produto.css";
import { FaShoppingCart, FaSlidersH, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import pergunta from "../../assets/pergunta.png";
import chat from "../../assets/chat.png";
import camisa1 from "../../assets/bermudarosa.jpeg";
import camisa2 from "../../assets/blusacinza.jpeg";
import camisa3 from "../../assets/blusarosa.jpeg";
import camisa4 from "../../assets/vestidopreto.jpeg";
import perfil from "../../assets/perfil.png";
import check from "../../assets/check.png";

const userDefault = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function DetalhesProduto() {
  const produto = {
    nome: "Bermuda Rosa",
    preco: 170,
    tamanho: "M",
    cor: "Rosa",
    estado: "Novo",
    descricao:
      "Bermuda rosa super confortável para utilizar no dia a dia e para atividades físicas ",
    imagens: [camisa1, camisa2, camisa3, camisa4],
    vendedor: {
      nome: "RaquelSilva",
      foto: userDefault,
      avaliacao: 4,
    },
  };

  // Itens de recomendados e do mesmo vendedor
  const recomendados = [{
    nome: "Blusa Cinza",
    preco: 120,
    imagem: camisa2,
  },
  {
    nome: "Blusa Rosa",
    preco: 140,
    imagem: camisa3,
  },
  {
    nome: "Vestido Preto",
    preco: 200,
    imagem: camisa4,
  },];
  const maisDoVendedor = [{
    nome: "Blusa Cinza",
    preco: 120,
    imagem: camisa2,
  },
  {
    nome: "Blusa Rosa",
    preco: 140,
    imagem: camisa3,
  },
  {
    nome: "Vestido Preto",
    preco: 200,
    imagem: camisa4,
  },];

  const [mainImg, setMainImg] = useState(produto.imagens[0]);

  // Zoom efeito
  useEffect(() => {
    const container = document.querySelector(".zoom-container");
    const image = container?.querySelector("img");
    if (!container || !image) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      image.style.transformOrigin = `${x}% ${y}%`;
      image.style.transform = "scale(2)";
    };

    const handleLeave = () => {
      image.style.transformOrigin = "center center";
      image.style.transform = "scale(1)";
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [mainImg]);

  const scrollLeft = (id) => {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-logo">
          <img src={logo} alt="Alphyz" />
        </div>

        <div className="header-search">
          <FaSlidersH className="search-icon-left" />
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="O que você está buscando?"
              className="search-input"
            />
            <FaSearch className="search-icon-right" />
          </div>
        </div>

        <div className="header-right">
          <a href="#" className="header-link">
            SOBRE NÓS
          </a>
          <img src={pergunta} className="header-icon" alt="ajuda" />
          <img src={chat} className="header-icon" alt="chat" />
          <FaShoppingCart className="header-icon" />
          <img src={perfil} className="seller-avatar" />
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="produto-container">
        <div className="left-side">
          {/* GALERIA */}
          <section className="gallery">
            <div className="thumbs">
              {produto.imagens.map((src, i) => (
                <button
                  key={i}
                  className={`thumb ${mainImg === src ? "active" : ""}`}
                  onClick={() => setMainImg(src)}
                >
                  <img src={src} alt={`miniatura ${i + 1}`} />
                </button>
              ))}
            </div>

            <div className="main-image-wrapper zoom-container">
              <img
                src={mainImg}
                alt="Imagem principal do produto"
                className="main-image"
              />
            </div>
          </section>

          {/* DESCRIÇÃO */}
          <section className="details">
            <h2>Descrição:</h2>
            <p className="desc">{produto.descricao}</p>
            <ul className="specs">
              <li>
                <strong>Tamanho:</strong> {produto.tamanho}
              </li>
              <li>
                <strong>Cor:</strong> {produto.cor}
              </li>
              <li>
                <strong>Estado:</strong> {produto.estado}
              </li>
            </ul>

            <div className="announced-by">
              <h3>Anunciado por:</h3>
              <div className="announcer">
                <img
                  src={perfil}
                  alt={produto.vendedor.nome}
                  className="ann-avatar"
                />
                <div>
                  <div className="ann-name">
                    {produto.vendedor.nome} <img src={check} alt="verificado" />
                  </div>
                  <div className="ann-rating">
                    {"★".repeat(produto.vendedor.avaliacao)}
                    {"☆".repeat(5 - produto.vendedor.avaliacao)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RECOMENDADOS */}
          <section className="carousel-section">
            <h2>Recomendados</h2>
            <div className="carousel-wrapper">
              <button
                className="arrow left"
                onClick={() => scrollLeft("recomendados")}
              >
                ‹
              </button>
              <div className="carousel" id="recomendados">
                {recomendados.map((item, i) => (
                  <div
                    key={i}
                    className="carousel-item"
                    onClick={() => setMainImg(item.img)}
                  >
                    <img src={item.img} alt={item.nome} />
                    <div className="nome">{item.nome}</div>
                    <div className="preco">KLV$ {item.preco}</div>
                  </div>
                ))}
              </div>
              <button
                className="arrow right"
                onClick={() => scrollRight("recomendados")}
              >
                ›
              </button>
            </div>
          </section>

          {/* MAIS DESTE VENDEDOR */}
          <section className="carousel-section">
            <h2>Mais deste vendedor</h2>
            <div className="carousel-wrapper">
              <button
                className="arrow left"
                onClick={() => scrollLeft("maisDoVendedor")}
              >
                ‹
              </button>
              <div className="carousel" id="maisDoVendedor">
                {maisDoVendedor.map((item, i) => (
                  <div
                    key={i}
                    className="carousel-item"
                    onClick={() => setMainImg(item.img)}
                  >
                    <img src={item.img} alt={item.nome} />
                    <div className="nome">{item.nome}</div>
                    <div className="preco">KLV$ {item.preco}</div>
                  </div>
                ))}
              </div>
              <button
                className="arrow right"
                onClick={() => scrollRight("maisDoVendedor")}
              >
                ›
              </button>
            </div>
          </section>
        </div>

        {/* CARD DE COMPRA */}
        <aside className="purchase-card">
          <h1 className="title">{produto.nome}</h1>
          <p className="price">KLV$ {produto.preco}</p>

          <div className="meta">
            <div>
              <strong>Tamanho:</strong> {produto.tamanho}
            </div>
            <div>
              <strong>Cor:</strong> {produto.cor}
            </div>
          </div>

          <div className="actions">
            <button className="btn primary">Comprar agora</button>
            <button className="btn secondary">Adicionar ao carrinho</button>
          </div>

          <div className="seller">
            <img
              src={perfil}
              alt={produto.vendedor.nome}
              className="seller-avatar"
            />
            <div className="seller-info">
              <div className="seller-name">
                {produto.vendedor.nome} <img src={check} alt="verificado" />
              </div>
              <div className="seller-rating">
                <span className="stars">
                  {"★".repeat(produto.vendedor.avaliacao)}
                  {"☆".repeat(5 - produto.vendedor.avaliacao)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="foot-col">
            <a href="#" className="foot-link">
              Termos de uso
            </a>
            <a href="#" className="foot-link">
              Política de privacidade
            </a>
          </div>

          <div className="foot-col foot-center">
            <span className="foot-muted">
              Precisa entrar em contato conosco?
            </span>
            <a href="mailto:jjfloresmkt@gmail.com" className="foot-link">
              Email: jjfloresmkt@gmail.com
            </a>
          </div>

          <div className="foot-col foot-right">
            <a href="#" className="foot-link">
              FAQ
            </a>
            <a href="#" className="foot-link">
              Ajuda
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}