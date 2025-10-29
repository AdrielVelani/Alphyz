// src/services/api.js

// Base da API – aceita BASE ou URL (ambos comuns em projetos React)
export const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/+$/, "")) ||
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/+$/, "")) ||
  "http://localhost:8080";

/* ================== Storage ================== */
export const getToken = () => {
  try {
    const t = localStorage.getItem("token") || localStorage.getItem("auth_token");
    return t && t !== "null" && t !== "undefined" ? t : null;
  } catch { return null; }
};
export const setToken = (t) => { try { localStorage.setItem("token", t || ""); } catch {} };
export const setUser  = (u) => { try { localStorage.setItem("user", JSON.stringify(u ?? null)); } catch {} };
export const clearAuth = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("userId");
  } catch {}
};

/* ================== HTTP core ================== */
async function parseResponse(res) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const parse = async () => (ct.includes("application/json") ? res.json() : res.text());
  let data = null;
  try { data = await parse(); } catch {}
  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.message || data?.error || "");
    throw new Error(`${res.status} ${res.statusText}${msg ? `: ${msg}` : ""}`);
  }
  return data;
}

/** Faz uma requisição à API. Evita enviar Authorization em rotas de autenticação. */
export async function request(path, { method="GET", body, headers={}, form=false } = {}) {
  const token = getToken();
  const url   = API_BASE + (path.startsWith("/") ? path : `/${path}`);
  const isAuthPath =
    /^\/?(autenticar|auth)\/login$/i.test(path) ||
    /^\/?login$/i.test(path) ||
    /^\/?usuarios\/login$/i.test(path);

  const baseHeaders = form ? {} : { "Content-Type": "application/json" };
  const authHeader  = token && !isAuthPath ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(url, {
    method,
    headers: { Accept: "application/json", ...baseHeaders, ...authHeader, ...headers },
    ...(body !== undefined ? { body: form ? body : JSON.stringify(body) } : {}),
  });
  return parseResponse(res);
}

export const getJSON = (p, o={}) => request(p, { method: "GET",    ...o });
export const postJSON= (p, b, o={}) => request(p, { method: "POST", body: b, ...o });
export const putJSON = (p, b, o={}) => request(p, { method: "PUT",  body: b, ...o });
export const delJSON = (p,   o={}) => request(p, { method: "DELETE",          ...o });

/* ================== Helpers ================== */
async function tryEndpoints(variants, exec) {
  let lastErr;
  for (const v of variants) {
    try { return await exec(v); } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("Falha na requisição");
}

/* ================== Auth & User ================== */
/** Login – mantém assinatura esperada pela tela: login(email, password) */
/** Login robusto – aceita (email, senha|password) OU ({ email, senha|password }) */
export async function login(arg1, arg2) {
  // Normaliza argumentos
  let email, secret;
  if (typeof arg1 === "object" && arg1) {
    email  = arg1.email || arg1.username || "";
    secret = arg1.senha ?? arg1.password ?? "";
  } else {
    email  = arg1 || "";
    secret = arg2 || "";
  }

  const endpoints = ["/autenticar/login", "/auth/login", "/usuarios/login", "/login"];
  const payloads = [
    { email, senha: secret },           // back pt-BR clássico
    { email, password: secret },        // variante EN
    { username: email, senha: secret }, // alguns backs usam "username"
    { username: email, password: secret }
  ];

  // tenta cada endpoint com cada payload até um responder 2xx
  let lastErr;
  for (const ep of endpoints) {
    for (const body of payloads) {
      try {
        const data = await postJSON(ep, body);

        // Token
        const token = data?.token || data?.accessToken || data?.jwt || data?.idToken || null;
        if (token) setToken(token);

        // Normaliza "user" para { id, nome } quando vier { userId, nome }
        const user =
          data?.usuario ||
          data?.user ||
          (data?.userId ? { id: data.userId, nome: data?.nome || null } : null);

        if (user?.id) {
          setUser(user);
          try { localStorage.setItem("userId", user.id); } catch {}
        }

        return { ...data, token, user };
      } catch (e) {
        lastErr = e; // guarda e segue tentando
      }
    }
  }
  throw lastErr || new Error("Falha no login");
}


/** getUserId – usado no perfil.js. NÃO chama me() para evitar recursão. */
export async function getUserId() {
  // 1) storage
  try {
    const fromUser = JSON.parse(localStorage.getItem("user") || "null") ||
                     JSON.parse(localStorage.getItem("auth_user") || "null") || null;
    const idLocal = fromUser?.id || fromUser?._id || fromUser?.userId || localStorage.getItem("userId");
    if (idLocal) return idLocal;
  } catch {}

  // 2) fallbacks diretos (sem usar me())
  try {
    const u = await getJSON("/usuarios/me");
    const id = u?.id || u?._id || u?.userId;
    if (id) { try { setUser(u); localStorage.setItem("userId", id); } catch {} return id; }
  } catch {}
  try {
    const u = await getJSON("/auth/me");
    const id = u?.id || u?._id || u?.userId;
    if (id) { try { setUser(u); localStorage.setItem("userId", id); } catch {} return id; }
  } catch {}

  throw new Error("Não foi possível determinar o usuário logado.");
}

/** Obter usuário logado */
export async function me() {
  // 1) tenta pelo id salvo
  let id = null;
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null") ||
              JSON.parse(localStorage.getItem("auth_user") || "null") || null;
    id = u?.id || u?._id || u?.userId || localStorage.getItem("userId") || null;
  } catch {}
  if (id) {
    try {
      const data = await getJSON(`/usuarios/${encodeURIComponent(id)}`);
      if (data) setUser(data);
      return data;
    } catch {}
  }

  // 2) fallbacks para APIs que tenham /me
  try { const d = await getJSON("/usuarios/me"); if (d) { setUser(d); return d; } } catch {}
  try { const d = await getJSON("/auth/me");     if (d) { setUser(d); return d; } } catch {}
  throw new Error("Endpoint de usuário não disponível.");
}

/** Atualizar dados do usuário logado */
export async function updateMe(patch) {
  const clean = Object.fromEntries(Object.entries(patch || {}).filter(([,v]) => v !== undefined));
  let id = null;
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    id = u?.id || u?._id || u?.userId || localStorage.getItem("userId") || null;
  } catch {}
  if (id) {
    try { const d = await putJSON(`/usuarios/${encodeURIComponent(id)}`, clean); if (d) setUser(d); return d; } catch {}
  }
  // fallback
  return putJSON("/usuarios/me", clean);
}

/* ================== Outros ================== */
export const getUser = (id) => getJSON(`/usuarios/${encodeURIComponent(id)}`);

// Em algumas versões, os "produtos" saíram como "roupas"; cobrimos ambos.
export async function getUserPosts(ownerId) {
  const q = `?ownerId=${encodeURIComponent(ownerId)}`;
  return tryEndpoints([`/roupas${q}`, `/produtos${q}`], (ep) => getJSON(ep));
}

export async function createPost(payload) {
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([k, v]) => v !== undefined && v !== null && fd.append(k, v));
  return tryEndpoints(["/roupas", "/produtos"], (ep) => request(ep, { method: "POST", form: true, body: fd }));
}

export const reportUser = (id, motivo = "report") =>
  postJSON(`/usuarios/${encodeURIComponent(id)}/report`, { motivo });

export default {
  API_BASE,
  request, getJSON, postJSON, putJSON, delJSON,
  getToken, setToken, setUser, clearAuth,
  login, getUserId, me, updateMe, getUser, getUserPosts, createPost, reportUser
};
