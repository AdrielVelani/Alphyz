export const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export async function postJSON(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let msg = "Erro na requisição";
    try { msg = await res.text(); } catch {}
    throw new Error(msg);
  }
  return res.json();
}
