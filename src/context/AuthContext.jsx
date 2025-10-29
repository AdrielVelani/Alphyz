import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, clearAuth, me as apiMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  async function refreshMe() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const u = await apiMe();
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u || null));
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuth();
    setUser(null);
  }

  useEffect(() => {
    if (getToken() && !user) refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
