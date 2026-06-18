import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (dadosUsuario) => setUser(dadosUsuario);
  const logout = () => setUser(null);

  const atualizarUser = (dadosParciais) => {
    setUser((prev) => (prev ? { ...prev, ...dadosParciais } : prev));
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://10.0.2.2:5500/usuarios/${user.id}`, {
        headers: { "x-usuario-id": user.id },
      });
      if (res.ok) {
        const dadosAtualizados = await res.json();
        setUser((prev) => ({
          ...prev,
          ...dadosAtualizados,
          estabelecimentoId: dadosAtualizados.estabelecimentoId ?? prev?.estabelecimentoId // ← preserva se não vier da API
        }));
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logado: !!user,
        login,
        logout,
        atualizarUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
