import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5500/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => localStorage.removeItem('token'));
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}