// src/services/api.js
// Base da API (ajuste REACT_APP_API_BASE no .env se precisar)
const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/+$/, '')) ||
  'http://localhost:8080';

/**
 * Wrapper para fetch com JSON e token opcional.
 * - Só envia Authorization se o token existir (e não for 'null'/'undefined').
 * - Lança erro com mensagem amigável vinda do backend (message/error) ou HTTP <status>.
 */
async function request(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const rawToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('auth_token') : null;
  const hasToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && hasToken ? { Authorization: `Bearer ${rawToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch {}
  } else {
    try { data = { message: await res.text() }; } catch {}
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const postJSON = (path, payload, opts = {}) =>
  request(path, { method: 'POST', body: payload, ...opts });

export const getJSON = (path, opts = {}) =>
  request(path, { method: 'GET', ...opts });

export const API = { getJSON, postJSON, API_BASE };
export default API;
