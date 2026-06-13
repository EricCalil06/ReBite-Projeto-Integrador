import { useState } from "react";
import { Link } from "react-router-dom";
import logoReBiteH from "../assets/logoReBiteH.png";
import { useContext } from "react";
import { AuthContext } from "/src/context/AuthContext.jsx";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  console.log("Logout disponível na NavBar:", logout);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="relative bg-[#FFFBF9] text-black mt-4 rounded-xl mx-4 max-w-7xl lg:mx-auto z-50">
      <div className="flex justify-between items-center p-4">
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logoReBiteH}
              alt="Logo ReBite"
              className="w-32 object-contain"
            />
          </Link>
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/" className="hover:text-[#F55D22] transition-colors">Início</Link>
            <Link to="/sobre" className="hover:text-[#F55D22] transition-colors">Sobre</Link>
            {user?.cargo === 'admin' && (
              <Link to="/painel-loja" className="hhover:text-[#F55D22] transition-colors">
                Painel do Estabelecimento
              </Link>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {!user ? (
            <Link to="/login">
              <button className="bg-[#F55D22] p-3 text-white font-bold w-auto rounded-xl hover:bg-[#e04e14] transition-colors whitespace-nowrap">
                Fazer Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-800">{user.nome}</span>

              {/* Círculo da foto de perfil */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : "?"}
              </div>

                <button
                  onClick={logout}
                  className="bg-red-600 p-3 text-white font-semibold w-auto rounded-xl hover:bg-red-700 transition-colors whitespace-nowrap">
                    Sair
              </button>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-black focus:outline-none p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="absolute top-full left-0 right-0 bg-[#FFFBF9] border-t border-gray-100 rounded-b-xl shadow-lg flex flex-col p-4 md:hidden gap-3">
          <Link to="/" onClick={() => setMenuAberto(false)} className="py-2 px-3 font-medium hover:bg-gray-50 rounded-lg">Início</Link>
          <Link to="/sobre" onClick={() => setMenuAberto(false)} className="py-2 px-3 font-medium hover:bg-gray-50 rounded-lg">Sobre</Link>
          
          <hr className="border-gray-100 my-1" />

          {!user ? (
            <Link to="/login" onClick={() => setMenuAberto(false)} className="w-full">
              <button className="bg-[#F55D22] p-3 text-white font-bold w-full rounded-xl">
                Fazer Login
              </button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <button onClick={() => setMenuAberto(false)} className="bg-[#F55D22] p-3 text-white font-bold w-full rounded-xl">
                Meu Perfil
              </button>

              {user.hasEstablishment && (
                <button onClick={() => setMenuAberto(false)} className="bg-green-600 p-3 text-white font-semibold w-full rounded-xl">
                  Acessar Loja
                </button>
              )}

              <button onClick={() => setMenuAberto(false)} className="bg-red-600 p-3 text-white font-semibold w-full rounded-xl"
                  onClick={logout}
                  className="bg-red-600 p-3 text-white font-semibold w-auto rounded-xl hover:bg-red-700 transition-colors whitespace-nowrap">
                  Sair
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;