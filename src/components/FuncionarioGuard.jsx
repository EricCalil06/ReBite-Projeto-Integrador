import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DebugPage from "../pages/DebugPage";

export default function FuncionarioGuard({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Se não está logado, deixa passar (o Login vai tratar)
    if (!user) return;

    // Se é funcionário e NÃO está no /debug, manda pra lá
    if (user.cargo === 'funcionario' && location.pathname !== '/debug') {
      navigate("/debug");
    }
  }, [user, navigate, location.pathname]);

  return children;
}