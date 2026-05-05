import { Link } from "react-router-dom";
import logoReBiteH from "../assets/logoReBiteH.png";

function NavBar({ user }) {
  return (
    <nav className="flex justify-between p-4 text-black bg-[#FFFBF9] mr-60 ml-60 mt-4 rounded-xl">

      {/* Itens a esquerda da NavBar */}
      <div className="flex gap-4 items-center mr-4 ml-4 ">
        <Link to="/">
          <img
            src={logoReBiteH}
            alt="Logo ReBite"
            className="w-32 mb-4 mr-4 items-center justify-center mx-auto"
          />
        </Link>
        <Link to="/">Início</Link>
        <Link to="/sobre">Sobre</Link>
      </div>

      {/* Itens a direita da NavBar */}
      <div className="flex gap-4 items-center mr-4 ml-4">
        {!user ? (
          <Link to="/login">
            <button className="bg-[#F55D22] p-3 text-white font-bold w-[120px] rounded-xl">
              Fazer Login
            </button>
          </Link>
        ) : (
          <>
            <button className="bg-[#F55D22] p-3 text-white font-bold w-[120px] rounded-xl">
              Meu Perfil
            </button>

            {user.hasEstablishment && (
              <button className="bg-green-600 p-3 text-white font-semibold w-[120px] rounded-xl">
                Acessar Loja
              </button>
            )}

            <button className="bg-red-600 p-3 text-white font-semibold w-[120px] rounded-xl">
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
