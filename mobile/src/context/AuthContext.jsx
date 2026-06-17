import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (dadosUsuario) => setUser(dadosUsuario);
  const logout = () => setUser(null);
  const atualizarUsuario = (dadosNovos) => setUser((prev) => ({ ...prev, ...dadosNovos }));

  return (
    <AuthContext.Provider value={{ user, logado: !!user, login, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}