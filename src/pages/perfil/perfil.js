// src/pages/perfil/perfil.js
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaEdit } from "react-icons/fa";

import "../shopping/shopping.css";
import "./perfil.css";
import SiteHeader from "../../components/SiteHeader";

import {
  getUser,
  getUserPosts,
  createPost,
  reportUser,
  updateMe,
  getUserId,
} from "../../services/api";

const ctx = require.context("../../assets", false, /\.(png|jpe?g|webp)$/i);
const IMGS = {};
ctx.keys().forEach((k) => {
  const base = k.replace("./", "").replace(/\.(png|jpe?g|webp)$/i, "");
  IMGS[base] = ctx(k);
});
const img = (key) => IMGS[key] || null;

/* ===== Modais ===== */
function NovoPostModal({ open, onClose, onSubmit }) {
  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="perfil-modal-overlay" onClick={onClose}>
      <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Faça um novo Post</h3>
        <div className="perfil-modal-grid">
          <label className="perfil-upload" aria-label="Enviar foto">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="perfil-upload-box">
              {imageFile ? imageFile.name : "Enviar foto"}
            </div>
          </label>
          <div className="perfil-form">
            <div className="perfil-field">
              <label>Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Camiseta preta"
              />
            </div>
            <div className="perfil-field">
              <label>Tamanho</label>
              <input
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                placeholder="Ex.: M"
              />
            </div>
            <div className="perfil-field">
              <label>Preço</label>
              <input
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex.: KLV$120"
              />
            </div>
            <div className="perfil-field">
              <label>Descrição</label>
              <textarea
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte um pouco sobre a peça..."
              />
            </div>
          </div>
        </div>
        <div className="perfil-modal-actions">
          <button className="btn btn-light" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={async () => {
              await onSubmit?.({ nome, tamanho, descricao, preco, imageFile });
              onClose();
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EditarPerfilModal({ open, onClose, initial, onSubmit }) {
  const [nome, setNome] = useState(initial?.nome || "");
  const [cidade, setCidade] = useState(initial?.cidade || "");
  const [estado, setEstado] = useState(initial?.estado || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(
    initial?.avatar || initial?.avatarUrl || ""
  );

  useEffect(() => {
    if (open) {
      setNome(initial?.nome || "");
      setCidade(initial?.cidade || "");
      setEstado(initial?.estado || "");
      setBio(initial?.bio || "");
      setAvatarUrl(initial?.avatar || initial?.avatarUrl || "");
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="perfil-modal-overlay" onClick={onClose}>
      <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Perfil</h3>
        <div className="perfil-modal-grid">
          <div className="perfil-form" style={{ gridColumn: "1 / -1" }}>
            <div className="perfil-field">
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="perfil-field">
              <label>Cidade</label>
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>
            <div className="perfil-field">
              <label>Estado</label>
              <input value={estado} onChange={(e) => setEstado(e.target.value)} />
            </div>
            <div className="perfil-field">
              <label>Avatar (URL)</label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="perfil-field">
              <label>Bio</label>
              <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="perfil-modal-actions">
          <button className="btn btn-light" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSubmit?.({ nome, cidade, estado, bio, avatarUrl })}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ===== Página Perfil ===== */
export default function Perfil() {
  const { id: routeId } = useParams();
  const nav = useNavigate();

  // /perfil   -> owner
  // /perfil/:id -> visitante
  const isOwner = !routeId;

  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("vitrine");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  async function carregarPerfil() {
    try {
      // decide o id a carregar
      const idToLoad = isOwner ? getUserId() : routeId;
      if (!idToLoad) {
        // sem usuário salvo -> manda logar
        nav("/login", { replace: true });
        return;
      }

      const u = await getUser(idToLoad);
      const ownerId = u.id || u._id || idToLoad;

      setPerfil({
        id: ownerId,
        nome: u.nome || u.name || "Usuário",
        avatar: u.avatarUrl || "https://placekitten.com/160/160",
        avatarUrl: u.avatarUrl,
        cidade: u.cidade || u.city || "São Paulo",
        estado: u.estado || u.state || "SP",
        bio: u.bio || "",
        rating: u.rating ?? 5,
        reviews: u.reviews ?? 50,
      });

      const arr = await getUserPosts(ownerId);
      setPosts(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error(e);
      // fallback simples para não quebrar o layout
      setPerfil({
        id: "fake",
        nome: "Usuário",
        avatar: "https://placekitten.com/160/160",
        cidade: "São Paulo",
        estado: "SP",
        bio: "",
        rating: 5,
        reviews: 0,
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    carregarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  async function handleCreatePost(form) {
    try {
      await createPost({
        nome: form.nome,
        tamanho: form.tamanho,
        descricao: form.descricao,
        preco: form.preco,
        image: form.imageFile,
      });
      const arr = await getUserPosts(perfil.id);
      setPosts(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error(e);
      alert(e.message || "Falha ao criar post");
    }
  }

  async function handleSalvarPerfil(payload) {
    try {
      await updateMe({
        nome: payload.nome,
        bio: payload.bio,
        cidade: payload.cidade,
        estado: payload.estado,
        avatarUrl: payload.avatarUrl,
      });
      await carregarPerfil(); // recarrega
      setOpenEdit(false);
    } catch (e) {
      console.error(e);
      alert(e.message || "Não foi possível salvar o perfil.");
    }
  }

  function handleDenunciar() {
    if (!perfil?.id) return;
    reportUser(perfil.id, "conteúdo inadequado").then(() =>
      alert("Denúncia enviada!")
    );
    setMenuOpen(false);
  }

  const reviews = useMemo(
    () => [
      { autor: "João P.", stars: 5, texto: "Entrega rápida!", data: "12/09/2025" },
      { autor: "Carla M.", stars: 4, texto: "Vendedora atenciosa.", data: "05/09/2025" },
    ],
    []
  );

  return (
    <div className="perfil-page">
      <SiteHeader />

      <main className="perfil-container">
        {perfil && (
          <section className="perfil-header">
            <img
              className="perfil-avatar"
              src={perfil.avatarUrl || perfil.avatar}
              alt={perfil.nome}
            />
            <div className="perfil-info">
              <h1>{perfil.nome}</h1>
              <div className="perfil-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < (perfil.rating || 0) ? "star on" : "star"} />
                ))}
                <span className="perfil-reviews">{perfil.reviews} Avaliações</span>
              </div>
              <div className="perfil-loc">
                <FaMapMarkerAlt /> {perfil.cidade} - {perfil.estado}
              </div>
              {perfil.bio && <p className="perfil-bio">{perfil.bio}</p>}
            </div>

            <div className="perfil-actions" ref={menuRef}>
              {isOwner ? (
                <button
                  className="perfil-ico"
                  title="Editar perfil"
                  aria-label="Editar perfil"
                  onClick={() => setOpenEdit(true)}
                >
                  <FaEdit />
                </button>
              ) : (
                <div className="perfil-menu-area">
                  <button
                    className="perfil-ico"
                    title="Mais opções"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    ⋯
                  </button>
                  {menuOpen && (
                    <div className="perfil-menu">
                      <button className="menu-item danger" onClick={handleDenunciar}>
                        Denunciar perfil
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Abas */}
        <div className="perfil-tabs">
          <button
            className={`tab ${activeTab === "vitrine" ? "active" : ""}`}
            onClick={() => setActiveTab("vitrine")}
          >
            Vitrine
          </button>
          <button
            className={`tab ${activeTab === "avaliacoes" ? "active" : ""}`}
            onClick={() => setActiveTab("avaliacoes")}
          >
            Avaliações
          </button>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === "vitrine" ? (
          <>
            <section className="perfil-vitrine">
              {isOwner && (
                <button
                  type="button"
                  className="novo-post-tile"
                  onClick={() => setOpenModal(true)}
                >
                  <div className="plus">+</div>
                  <span>Novo post</span>
                </button>
              )}
              {posts.map((p, i) => (
                <div key={p.id || p._id || i} className="perfil-card">
                  <div className="perfil-card-img">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.nome} />
                    ) : (
                      <div className="perfil-ph">FOTO</div>
                    )}
                  </div>
                  <div className="perfil-card-info">
                    <div className="perfil-row1">
                      <div className="perfil-nome">{p.nome}</div>
                      <div className="perfil-tag">{p.tamanho}</div>
                    </div>
                    <div className="perfil-row2">
                      <div className="perfil-preco">{p.preco ?? "KLV$"}</div>
                      <button className="perfil-save" aria-label="Favoritar">♡</button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            <div className="perfil-more">
              <button className="btn-showmore">Mostrar Mais</button>
            </div>
          </>
        ) : (
          <section className="perfil-avaliacoes">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-head">
                  <div className="review-user">{r.autor}</div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <FaStar key={k} className={k < r.stars ? "star on" : "star"} />
                    ))}
                  </div>
                </div>
                <div className="review-body">{r.texto}</div>
                <div className="review-foot">{r.data}</div>
              </div>
            ))}
          </section>
        )}
      </main>

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

      <NovoPostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreatePost}
      />
      <EditarPerfilModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initial={perfil}
        onSubmit={handleSalvarPerfil}
      />
    </div>
  );
}
