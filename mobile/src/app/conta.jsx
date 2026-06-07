import { useAuth } from "../context/AuthContext";
import Conta from "../pages/Conta";
import Login from "../pages/Login";

export default function Page() {
  const { logado } = useAuth();

  if (!logado) return <Login />;

  return <Conta />;
}