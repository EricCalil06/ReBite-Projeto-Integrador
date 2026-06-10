import { AuthProvider } from "../context/AuthContext";
import { CarrinhoProvider } from "../context/CarrinhoContext";
import NavbarMobile from "../components/NavbarMobile";

export default function Layout() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <NavbarMobile />
      </CarrinhoProvider>
    </AuthProvider>
  );
}