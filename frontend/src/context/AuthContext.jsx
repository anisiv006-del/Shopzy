import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setUnauthorizedHandler } from "../api/client";

const AuthContext = createContext(null);
const storageKey = "shop_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || "null"),
  );
  const logout = () => {
    setSession(null);
    localStorage.removeItem(storageKey);
  };
  const login = (value) => {
    setSession(value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  useEffect(() => {
    if (!session?.token) return undefined;
    try {
      const { exp } = JSON.parse(atob(session.token.split(".")[1]));
      const timer = window.setTimeout(
        logout,
        Math.max(0, exp * 1000 - Date.now()),
      );
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [session?.token]);

  const value = useMemo(
    () => ({ ...session, user: session?.user, login, logout }),
    [session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
