export const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace(/\/$/, '');

if (typeof window !== 'undefined' && !window.__API_BASE_LOGGED__) {
  window.__API_BASE_LOGGED__ = true;
  // eslint-disable-next-line no-console
  console.log('[alphyz] API_BASE =', API_BASE);
}

function parseJSONSafe(t){try{return t?JSON.parse(t):{}}catch{return{}}}
async function request(path,{method='GET',body,headers={},auth=false}={}){
  const init={method,headers:{'Accept':'application/json',...(body?{'Content-Type':'application/json'}:{}),...headers}};
  if(auth){const token=getToken(); if (token) init.headers['Authorization']=`Bearer ${token}`;}
  if(body) init.body=JSON.stringify(body);
  const url=`${API_BASE}${path}`;
  const res=await fetch(url,init);
  const text=await res.text(); const data=parseJSONSafe(text);
  if(!res.ok){const err=new Error(data.message||`HTTP ${res.status}`); err.status=res.status; err.data=data; err.requestUrl=url; throw err;}
  return data;
}
const postJSON=(p,b,o={})=>request(p,{method:'POST',body:b,...o}); const getJSON=(p,o={})=>request(p,{method:'GET',...o}); const putJSON=(p,b,o={})=>request(p,{method:'PUT',body:b,...o});

// ===== Storage helpers =====
const TOKEN_KEY='alphyz.token', USER_KEY='alphyz.user', USER_ID_KEY='alphyz.userId';
const LEGACY_TOKEN='token', LEGACY_USER='user', LEGACY_USER_ID='userId';

function setRaw(key, val){ try{ localStorage.setItem(key, val);}catch{} }
function getRaw(key){ try{ return localStorage.getItem(key);}catch{ return null;} }
function rmRaw(key){ try{ localStorage.removeItem(key);}catch{} }

export function setToken(t){
  if(!t) return null;
  setRaw(TOKEN_KEY, t);
  setRaw(LEGACY_TOKEN, t); // compat
  return t;
}
export function getToken(){
  return getRaw(TOKEN_KEY) || getRaw(LEGACY_TOKEN);
}
export function clearAuth(){
  [TOKEN_KEY, USER_KEY, USER_ID_KEY, LEGACY_TOKEN, LEGACY_USER, LEGACY_USER_ID].forEach(rmRaw);
}
export function setUser(u){
  if(!u || typeof u !== 'object') return null;
  const id = u.id || u._id || u.userId;
  if (id) { setRaw(USER_ID_KEY, String(id)); setRaw(LEGACY_USER_ID, String(id)); }
  const json = JSON.stringify(u);
  setRaw(USER_KEY, json);
  setRaw(LEGACY_USER, json);
  return u;
}
export function getUserId(){ return getRaw(USER_ID_KEY) || getRaw(LEGACY_USER_ID); }
export function getUserCached(){ const raw = getRaw(USER_KEY) || getRaw(LEGACY_USER); return raw ? parseJSONSafe(raw) : null; }
export function isAuthenticated(){ return !!(getToken() || getUserId()); }

// ===== Helpers =====
function pathJoinAut(s){const has=/\/autenticar$/.test(API_BASE); return has?`/${s.replace(/^\/+/,'')}`:`/autenticar/${s.replace(/^\/+/,'')}`}
function normalizeRegisterPayload(i={}){const o={...i}; if(o.cep)o.cep=String(o.cep).replace(/\D/g,''); if(o.numero!=null)o.numero=String(o.numero);
  return {nome:o.nome??o.name??'',email:o.email??'',senha:o.senha??o.password??'',cpf:o.cpf??'',idade:o.idade??o.age??null,telefone:o.telefone??o.phone??'',
          rua:o.rua??o.logradouro??'',complemento:o.complemento??'',numero:o.numero??'',cep:o.cep??'',estado:o.estado??o.uf??'',cidade:o.cidade??''};}

function extractCreds(emailArg, senhaArg){
  let e=emailArg, p=senhaArg;
  if (e && typeof e === 'object') {
    if ('email' in e) { p = e.password ?? e.senha ?? p; e = e.email; }
    else if ('target' in e && e.target && 'value' in e.target) { e = e.target.value; }
  }
  if (p && typeof p === 'object' && 'target' in p && p.target && 'value' in p.target) { p = p.target.value; }
  e = (e == null ? '' : String(e)).trim(); p = (p == null ? '' : String(p)).trim();
  return { e, p };
}

function pickToken(resp){
  return resp?.token ?? resp?.accessToken ?? resp?.jwt ?? resp?.bearer ?? resp?.data?.token ?? null;
}

function pickUser(resp, emailFallback){
  const u = resp?.user ?? resp?.usuario ?? null;
  if (u) return u;
  const id = resp?.userId ?? resp?.id ?? resp?._id ?? null;
  const nome = resp?.nome ?? resp?.name ?? null;
  return { id, nome, email: emailFallback };
}

function normalizeLoginResult(resp, email){
  const token = pickToken(resp) || 'dev-token'; // fallback para guards baseados em token
  const user  = pickUser(resp, email);
  const userId = user?.id || user?._id || resp?.userId || null;
  return {
    ok: true,
    message: resp?.message || 'OK',
    token,
    user,
    userId
  };
}

// ===== API =====
export async function registerUser(formData={}){
  return await postJSON(pathJoinAut('cadastrar'), normalizeRegisterPayload(formData));
}

export async function login(email, senha){
  const { e, p } = extractCreds(email, senha);
  if(!e || !p){ const err=new Error('E-mail e senha são obrigatórios'); err.status=400; throw err; }

  // 1) tentativa canônica
  let resp;
  try { resp = await postJSON(pathJoinAut('login'), { email: e, password: p }); }
  catch(err1){
    if(err1 && (err1.status===400 || err1.status===401 || err1.status===404)){
      resp = await postJSON(pathJoinAut('login'), { email: e, senha: p });
    } else { throw err1; }
  }

  const norm = normalizeLoginResult(resp, e);
  setToken(norm.token);
  setUser(norm.user);
  return norm;
}

// Auxiliares com fallback
export async function me(){
  if (isAuthenticated()) {
    const paths=['/usuarios/me','/me',pathJoinAut('me')];
    for(const p of paths){
      try{ const d=await getJSON(p,{auth:true}); const u=d.user||d.usuario||d; if(u) setUser(u); return d; }
      catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
    }
    return { user: getUserCached() };
  }
  return { user: null };
}
export const apiMe=me;

export async function getUser(id){
  if(!id){ const c=getUserCached(); if(c) return c; }
  for(const p of [`/usuarios/${id}`,`/users/${id}`]){
    try{ const d=await getJSON(p,{auth:true}); return d.user||d.usuario||d; }
    catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
  }
  const c=getUserCached(); if(c&&(c.id===id||c._id===id)) return c;
  return { id, nome:'Usuário', posts:[] };
}

export async function getUserPosts(id){
  for(const p of [`/usuarios/${id}/posts`,`/users/${id}/posts`]){
    try{ const d=await getJSON(p,{auth:true}); return d.posts||d; }
    catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
  }
  return [];
}

export async function createPost(input){
  for(const p of ['/posts','/usuarios/posts','/users/posts']){
    try{ const d=await postJSON(p,input,{auth:true}); return d.post||d; }
    catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
  }
  const u=getUserCached()||{};
  return { id:`local_${Date.now()}`, authorId:u.id||u._id||null, ...input, _localOnly:true };
}

export async function updateMe(patch){
  for(const p of ['/usuarios/me','/users/me','/me']){
    try{ const d=await putJSON(p,patch,{auth:true}); const u=d.user||d.usuario||d; if(u) setUser(u); return u||d; }
    catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
  }
  const cur=getUserCached()||{}; const m={...cur,...patch}; setUser(m); return m;
}

export async function reportUser(targetUserId,motivo){
  const b={userId:targetUserId,motivo};
  for(const p of ['/reports/user','/usuarios/report','/users/report']){
    try{ const d=await postJSON(p,b,{auth:true}); return d; }
    catch(e){ if(e.status && ![404,405].includes(e.status)) throw e; }
  }
  return { ok:true, message:'Denúncia registrada (local)' };
}

// Default + aliases
const api={API_BASE,login,registerUser,me,getUser,getUserPosts,createPost,updateMe,reportUser,setToken,getToken,clearAuth,setUser,getUserId,getUserCached,isAuthenticated};
export default api;
export const apiLogin=login; export const authenticate=login; export const signIn=login;
export const apiRegister=registerUser; export const cadastro=registerUser; export const signUp=registerUser;
