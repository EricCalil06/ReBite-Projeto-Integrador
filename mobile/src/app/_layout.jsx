import { AuthProvider } from "../context/AuthContext";
import { CarrinhoProvider } from "../context/CarrinhoContext";
import NavbarMobile from "../components/NavbarMobile";
import CustomNotification from "../components/customNotification.jsx";

export default function Layout() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <NavbarMobile />
        <CustomNotification />
      </CarrinhoProvider>
    </AuthProvider>
  );
}