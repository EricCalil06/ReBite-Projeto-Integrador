import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthRedirector({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checarDestino() {
      if (!user) {
        setLoading(false);
        return;
      }

      if (location.pathname === "/debug" || location.pathname === "/painel-loja" || location.pathname === "/cadastrar-loja") {
        setLoading(false);
        return;
      }

      if (user.cargo === 'funcionario') {
        navigate("/debug");
      } else if (user.cargo === 'admin') {
          const res = await fetch("http://localhost:5500/estabelecimento/minha-loja", {
              headers: { "x-usuario-id": user.id }
          });
          const data = await res.json();

          if (data.existe) {
              navigate(`/painel-loja/${data.lojaId}`);
          } else {
              navigate("/cadastrar-loja");
          }
      }
      setLoading(false);
    }

    checarDestino();
  }, [user, navigate, location.pathname]);

  if (loading) return <div>Carregando...</div>;

  return children;
}