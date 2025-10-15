import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload || {};
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (jwt) => {
    const payload = decodeJwt(jwt); // backend sets { id, role, email }
    setToken(jwt);
    setUser({ email: payload.email, role: payload.role, id: payload.id });
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const isAuthed = !!token;
  const isSales = user?.role === "salesmanager" || user?.role === "admin";

  const value = useMemo(() => ({ token, user, isAuthed, isSales, login, logout }), [token, user, isAuthed, isSales]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
