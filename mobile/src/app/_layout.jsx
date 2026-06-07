import { AuthProvider } from "../context/AuthContext";
import NavbarMobile from "../components/NavbarMobile";

export default function Layout() {
  return (
    <AuthProvider>
      <NavbarMobile />
    </AuthProvider>
  );
}