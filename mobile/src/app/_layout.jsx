import { AuthProvider } from "../context/AuthContext";
import { CarrinhoProvider } from "../context/CarrinhoContext";
import NavbarMobile from "../components/NavbarMobile";
import CustomNotification from "../components/customNotification.jsx";
import CarrinhoFlutuante from "../components/CarrinhoFlutuante";

export default function Layout() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <NavbarMobile />
        <CustomNotification />
        <CarrinhoFlutuante />
      </CarrinhoProvider>
    </AuthProvider>
  );
}