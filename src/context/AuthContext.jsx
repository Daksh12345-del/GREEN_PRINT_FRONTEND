import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    if (!api.getToken()) {
      setUser(null);
      setCompany(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
      setCompany(data.company);
    } catch {
      api.setToken(null);
      setUser(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  async function doLogin(email, password) {
    const data = await api.login(email, password);
    api.setToken(data.token);
    setUser(data.user);
    await loadMe();
  }

  async function doRegisterCompany(payload) {
    const data = await api.registerCompany(payload);
    api.setToken(data.token);
    setUser(data.user);
    await loadMe();
  }

  function doLogout() {
    api.setToken(null);
    setUser(null);
    setCompany(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, company, loading, login: doLogin, registerCompany: doRegisterCompany, logout: doLogout, refresh: loadMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
