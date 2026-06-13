import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
};
    
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:5500/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token inválido');
      })
      .then(data => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}