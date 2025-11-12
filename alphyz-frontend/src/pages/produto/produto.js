// src/pages/produto/produto.js
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/SiteHeader"; // mesmo header do shopping/perfil
import "./produto.css";

import perfil from "../../assets/perfil.png";
import check from "../../assets/check.png";

/* === IMAGENS CORRETAS (existentes na pasta assets) === */
import img1 from "../../assets/bermudarosa.jpeg";
import img2 from "../../assets/blusacinza.jpeg";
import img3 from "../../assets/blusarosa.jpeg";

export default function DetalhesProduto() {
  const produto = {
    nome: "Bermuda Rosa",
    preco: 170,
    tamanho: "M",
    cor: "Rosa",
    estado: "Novo",
    vendedor: { nome: "RaquelSilva", avaliacao: 4 },
    descricao:
      "Bermuda rosa super confortável para utilizar no dia a dia e para atividades físicas",
    imagens: [img1, img2, img3],
  };

  const recomendados = [
    { nome: "Bermuda Rosa", preco: 70,  tamanho: "M", img: img1 },
    { nome: "Regata Cinza",  preco: 50,  tamanho: "M", img: img2 },
    { nome: "Top Rosa",      preco: 150, tamanho: "M", img: img3 },
  ];

  const maisDoVendedor = [
    { nome: "Bermuda Rosa", preco: 90,  tamanho: "M", img: img1 },
    { nome: "Regata Cinza", preco: 120, tamanho: "M", img: img2 },
    { nome: "Top Rosa",     preco: 200, tamanho: "M", img: img3 },
  ];

  const [mainImg, setMainImg] = useState(produto.imagens[0]);

  // Zoom simples
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

  const scrollLeft  = (id) => { document.getElementById(id)?.scrollBy({ left: -200, behavior: "smooth" }); };
  const scrollRight = (id) => { document.getElementById(id)?.scrollBy({ left:  200, behavior: "smooth" }); };

  return (
    <>
      {/* HEADER padronizado (logo → /shopping, perfil e sair condicionados ao token) */}
      <SiteHeader />

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
              <img src={mainImg} alt="Imagem principal do produto" className="main-image" />
            </div>
          </section>

          {/* DESCRIÇÃO */}
          <section className="details">
            <h2>Descrição:</h2>
            <p className="desc">{produto.descricao}</p>
            <ul className="specs">
              <li><strong>Tamanho:</strong> {produto.tamanho}</li>
              <li><strong>Cor:</strong> {produto.cor}</li>
              <li><strong>Estado:</strong> {produto.estado}</li>
            </ul>

            <div className="announced-by">
              <h3>Anunciado por:</h3>
              <div className="announcer">
                <img src={perfil} alt={produto.vendedor.nome} className="ann-avatar" />
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
              <button className="arrow left" onClick={() => scrollLeft("recomendados")}>‹</button>
              <div className="carousel" id="recomendados">
                {recomendados.map((item, i) => (
                  <div key={i} className="carousel-item" onClick={() => setMainImg(item.img)}>
                    <img src={item.img} alt={item.nome} />
                    <div className="nome">{item.nome}</div>
                    <div className="preco">KLV$ {item.preco}</div>
                    <div className="preco">{item.tamanho}</div>
                  </div>
                ))}
              </div>
              <button className="arrow right" onClick={() => scrollRight("recomendados")}>›</button>
            </div>
          </section>

          {/* MAIS DESTE VENDEDOR */}
          <section className="carousel-section">
            <h2>Mais deste vendedor</h2>
            <div className="carousel-wrapper">
              <button className="arrow left" onClick={() => scrollLeft("maisDoVendedor")}>‹</button>
              <div className="carousel" id="maisDoVendedor">
                {maisDoVendedor.map((item, i) => (
                  <div key={i} className="carousel-item" onClick={() => setMainImg(item.img)}>
                    <img src={item.img} alt={item.nome} />
                    <div className="nome">{item.nome}</div>
                    <div className="preco">KLV$ {item.preco}</div>
                    <div className="preco">{item.tamanho}</div>
                  </div>
                ))}
              </div>
              <button className="arrow right" onClick={() => scrollRight("maisDoVendedor")}>›</button>
            </div>
          </section>
        </div>

        {/* CARD DE COMPRA */}
        <aside className="purchase-card">
          <h1 className="title">{produto.nome}</h1>
          <p className="price">KLV$ {produto.preco}</p>

          <div className="meta">
            <div><strong>Tamanho:</strong> {produto.tamanho}</div>
            <div><strong>Cor:</strong> {produto.cor}</div>
          </div>

          <div className="actions">
            <button className="btn primary">Comprar agora</button>
            <button className="btn secondary">Adicionar ao carrinho</button>
          </div>

          <div className="seller">
            <img src={perfil} alt={produto.vendedor.nome} className="seller-avatar" />
            <div className="seller-info">
              <div className="seller-name">
                {produto.vendedor.nome} <img src={check} alt="verified" />
              </div>
              <div className="seller-rating">
                {"★".repeat(produto.vendedor.avaliacao)}
                {"☆".repeat(5 - produto.vendedor.avaliacao)}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="foot-col">
            <a href="#" className="foot-link">Termos de uso</a>
            <a href="#" className="foot-link">Política de privacidade</a>
          </div>
          <div className="foot-col foot-center">
            <span className="foot-muted">Precisa entrar em contato conosco?</span>
            <a href="mailto:jjfloresmkt@gmail.com" className="foot-link">Email: jjfloresmkt@gmail.com</a>
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
