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
    if (!user) return;

    if (user.cargo === 'funcionario' && location.pathname !== '/debug') {
      navigate("/debug");
    }
  }, [user, navigate, location.pathname]);

  return children;
}