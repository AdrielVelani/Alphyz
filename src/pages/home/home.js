import React from "react";
import { motion } from "framer-motion";
import "./home.css";
import logo from "../../assets/logobranco.png";

export default function Home() {
  return (
    <div className="home-container">
      {/* Logo -> /shopping */}
      <motion.div
        className="logo-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <a href="/shopping" aria-label="Voltar para a loja">
          <img src={logo} alt="alphyz" className="logo-img" />
        </a>
      </motion.div>

      {/* Texto */}
      <motion.div
        className="text-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: "easeOut", delay: 0.2 }}
      >
        <p>
          O fast fashion criou um ciclo de consumo rápido: a gente compra, usa pouco e
          descarta. Isso polui o meio ambiente, gasta recursos e incentiva um jeito de
          viver insustentável. Precisamos mudar essa lógica!
        </p>
        <p>
          A Alphyz é uma plataforma de economia criativa e moda sustentável baseada em trocas.
          Em vez de comprar sempre roupas novas, a pessoa pode circular peças, manter o estilo
          e ainda economizar. Nosso propósito vai além da moda, queremos criar uma comunidade
          que entende que consumir sem consciência esgota não só os recursos da Terra, mas
          também as possibilidades de futuro.
        </p>
      </motion.div>
    </div>
  );
}
