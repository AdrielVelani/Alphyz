// Cleaned & organized API helper module
// Notes:
// - Preserved original logic but improved formatting, safety, naming, and consistency.
// - Removed all “posts” logic → now everything usa “produtos”.

export const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8080')
  .replace(/\/$/, '');

if (typeof window !== 'undefined' && !window.__API_BASE_LOGGED__) {
  window.__API_BASE_LOGGED__ = true;
  console.log('[alphyz] API_BASE =', API_BASE);
}

// ===== Utilities =====
const TOKEN_KEY = 'alphyz.token';
const USER_KEY = 'alphyz.user';
const USER_ID_KEY = 'alphyz.userId';
const LEGACY_TOKEN = 'token';
const LEGACY_USER = 'user';
const LEGACY_USER_ID = 'userId';

function parseJSONSafe(text) {
  try { return text ? JSON.parse(text) : {}; }
  catch { return {}; }
}

function setRaw(k, v) { try { localStorage.setItem(k, v); } catch {} }
function getRaw(k) { try { return localStorage.getItem(k); } catch { return null; } }
function rmRaw(k) { try { localStorage.removeItem(k); } catch {} }

// ===== Auth Storage =====
export function setToken(t) {
  if (!t) return null;
  setRaw(TOKEN_KEY, t);
  setRaw(LEGACY_TOKEN, t);
  return t;
}

export function getToken() {
  return getRaw(TOKEN_KEY) || getRaw(LEGACY_TOKEN);
}

export function clearAuth() {
  [TOKEN_KEY, USER_KEY, USER_ID_KEY, LEGACY_TOKEN, LEGACY_USER, LEGACY_USER_ID].forEach(rmRaw);
}

export function setUser(u) {
  if (!u || typeof u !== 'object') return null;
  const id = u.id || u._id || u.userId;
  if (id) {
    setRaw(USER_ID_KEY, String(id));
    setRaw(LEGACY_USER_ID, String(id));
  }
  const json = JSON.stringify(u);
  setRaw(USER_KEY, json);
  setRaw(LEGACY_USER, json);
  return u;
}

export function getUserId() {
  return getRaw(USER_ID_KEY) || getRaw(LEGACY_USER_ID);
}

export function getUserCached() {
  const raw = getRaw(USER_KEY) || getRaw(LEGACY_USER);
  return raw ? parseJSONSafe(raw) : null;
}

export function isAuthenticated() {
  return !!(getToken() || getUserId());
}

// ===== Networking =====
async function request(path, { method='GET', body, headers={}, auth=false } = {}) {
  const init = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  };

  if (auth) {
    const token = getToken();
    if (token) init.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) init.body = JSON.stringify(body);

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, init);
  const text = await res.text();
  const data = parseJSONSafe(text);

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    err.requestUrl = url;
    throw err;
  }

  return data;
}

const postJSON = (p,b,o={}) => request(p,{ method:'POST', body:b, ...o });
const getJSON  = (p,o={}) => request(p,{ method:'GET',  ...o });
const putJSON  = (p,b,o={}) => request(p,{ method:'PUT', body:b, ...o });

// ===== Helpers =====
function pathJoinAut(s) {
  const has = /\/autenticar$/.test(API_BASE);
  return has ? `/${s.replace(/^\/+/,'')}` : `/autenticar/${s.replace(/^\/+/,'')}`;
}

function normalizeRegisterPayload(i = {}) {
  const o = { ...i };
  if (o.cep) o.cep = String(o.cep).replace(/\D/g, '');
  if (o.numero != null) o.numero = String(o.numero);

  return {
    nome: o.nome ?? o.name ?? '',
    email: o.email ?? '',
    senha: o.senha ?? o.password ?? '',
    cpf: o.cpf ?? '',
    idade: o.idade ?? o.age ?? null,
    telefone: o.telefone ?? o.phone ?? '',
    rua: o.rua ?? o.logradouro ?? '',
    complemento: o.complemento ?? '',
    numero: o.numero ?? '',
    cep: o.cep ?? '',
    estado: o.estado ?? o.uf ?? '',
    cidade: o.cidade ?? '',
  };
}

function extractCreds(emailArg, senhaArg) {
  let e = emailArg, p = senhaArg;

  if (e && typeof e === 'object') {
    if ('email' in e) {
      p = e.password ?? e.senha ?? p;
      e = e.email;
    } else if ('target' in e && e.target?.value) {
      e = e.target.value;
    }
  }

  if (p && typeof p === 'object' && p.target?.value) p = p.target.value;

  e = (e == null ? '' : String(e)).trim();
  p = (p == null ? '' : String(p)).trim();
  return { e, p };
}

function pickToken(r) {
  return r?.token || r?.accessToken || r?.jwt || r?.bearer || r?.data?.token || null;
}

function pickUser(r, emailFallback) {
  const u = r?.user || r?.usuario;
  if (u) return u;
  const id = r?.userId || r?.id || r?._id || null;
  const nome = r?.nome || r?.name || null;
  return { id, nome, email: emailFallback };
}

function normalizeLoginResult(resp, email) {
  const token = pickToken(resp) || 'dev-token';
  const user = pickUser(resp, email);
  const userId = user?.id || user?._id || resp?.userId || null;
  return { ok: true, message: resp?.message || 'OK', token, user, userId };
}

// ===== API =====
export async function registerUser(formData = {}) {
  return await postJSON(pathJoinAut('cadastrar'), normalizeRegisterPayload(formData));
}

export async function login(email, senha) {
  const { e, p } = extractCreds(email, senha);
  if (!e || !p) {
    const err = new Error('E-mail e senha são obrigatórios');
    err.status = 400;
    throw err;
  }

  let resp;
  try {
    resp = await postJSON(pathJoinAut('login'), { email: e, password: p });
  } catch (err1) {
    if ([400,401,404].includes(err1.status)) {
      resp = await postJSON(pathJoinAut('login'), { email: e, senha: p });
    } else {
      throw err1;
    }
  }

  const norm = normalizeLoginResult(resp, e);
  setToken(norm.token);
  setUser(norm.user);
  return norm;
}

export async function me() {
  if (isAuthenticated()) {
    const paths = ['/usuarios/me','/me', pathJoinAut('me')];
    for (const p of paths) {
      try {
        const d = await getJSON(p, { auth:true });
        const u = d.user || d.usuario || d;
        if (u) setUser(u);
        return d;
      } catch (e) {
        if (e.status && ![404,405].includes(e.status)) throw e;
      }
    }
    return { user: getUserCached() };
  }
  return { user:null };
}
export const apiMe = me;

export async function getUser(id) {
  if (!id) {
    const c = getUserCached();
    if (c) return c;
  }

  for (const p of [`/usuarios/${id}`, `/users/${id}`]) {
    try {
      const d = await getJSON(p, { auth:true });
      return d.user || d.usuario || d;
    } catch (e) {
      if (e.status && ![404,405].includes(e.status)) throw e;
    }
  }

  const c = getUserCached();
  if (c && (c.id === id || c._id === id)) return c;
  return { id, nome:'Usuário', produtos:[] };
}

export async function getUserProducts(id){
  try {
    const d = await getJSON(`/produtos/usuario/${id}`, { auth: true });
    return d || [];
  } catch (e) {
    if (e.status && ![404,405].includes(e.status)) throw e;
    return [];
  }
}

export async function createProduct(data) {
  const token = getToken();
  const usuarioId = getUserId();

  const payload = {
    ...data,
    usuarioId
  };

  const response = await fetch(`${API_BASE}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Erro ao criar produto");
  }

  return response.json();
}

export async function updateMe(patch) {
  for (const p of ['/usuarios/me','/users/me','/me']) {
    try {
      const d = await putJSON(p, patch, { auth:true });
      const u = d.user || d.usuario || d;
      if (u) setUser(u);
      return u || d;
    } catch (e) {
      if (e.status && ![404,405].includes(e.status)) throw e;
    }
  }
  const cur = getUserCached() || {};
  const m = { ...cur, ...patch };
  setUser(m);
  return m;
}

export async function reportUser(targetUserId, motivo) {
  const b = { userId: targetUserId, motivo };
  for (const p of ['/reports/user','/usuarios/report','/users/report']) {
    try {
      return await postJSON(p, b, { auth:true });
    } catch (e) {
      if (e.status && ![404,405].includes(e.status)) throw e;
    }
  }
  return { ok:true, message:'Denúncia registrada (local)' };
}

// ===== Default Export + Aliases =====
const api = {
  API_BASE,
  login, registerUser,
  me, getUser, getUserProducts,
  updateMe, reportUser,
  setToken, getToken, clearAuth,
  setUser, getUserId, getUserCached, isAuthenticated,
};
export default api;

export const apiLogin = login;
export const authenticate = login;
export const signIn = login;
export const apiRegister = registerUser;
export const cadastro = registerUser;
export const signUp = registerUser;