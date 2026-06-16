import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logoReBiteH from "../assets/logoReBiteH.png";
import { AuthContext } from "/src/context/AuthContext.jsx";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [menuAberto, setMenuAberto] = useState(false);
  const [inboxAberto, setInboxAberto] = useState(false);
  const [convites, setConvites] = useState([]);

  const carregarConvites = async () => {
    if (!user || !user.id) return;
    try {
      const res = await fetch("http://localhost:5500/convites/meus-convites", {
        headers: { "x-usuario-id": user.id }
      });
      if (res.ok) {
        const data = await res.json();
        setConvites(data);
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  useEffect(() => {
    carregarConvites();
  }, [user]);

  const responderConvite = async (id, resposta) => {
    try {
      const res = await fetch(`http://localhost:5500/convites/${id}/responder`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "x-usuario-id": user.id 
        },
        body: JSON.stringify({ resposta })
      });
      
      if (res.ok) {
        alert(`Convite ${resposta} com sucesso!`);
        setInboxAberto(false);
        carregarConvites();
        
        if (resposta === 'aceito') {
          window.location.reload();
        }
      } else {
        alert("Não foi possível responder ao convite.");
      }
    } catch (error) {
      console.error("Erro ao responder convite:", error);
    }
  };

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
            
            {user?.cargo === 'admin' && !user.hasEstablishment && (
              <Link 
                to="/cadastrar-loja" 
                className="hover:text-[#F55D22] transition-colors"
              >
                Cadastrar uma Loja
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
              
              {user.hasEstablishment && (
                <Link to="/painel-loja">
                  <button className="bg-gray-100 border border-gray-200 text-gray-800 px-4 py-2 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
                    Acessar Painel
                  </button>
                </Link>
              )}

              <div className="relative">
                <button 
                  onClick={() => setInboxAberto(!inboxAberto)} 
                  className="p-2 text-gray-600 hover:text-[#F55D22] transition-colors relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  
                  {convites.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {convites.length}
                    </span>
                  )}
                </button>

                {inboxAberto && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl p-4 z-50">
                    <h3 className="font-bold text-gray-800 mb-3">Caixa de Entrada</h3>
                    {convites.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">Nenhum convite novo.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {convites.map(c => (
                          <div key={c._id} className="border border-gray-100 p-3 rounded-xl bg-orange-50">
                            <p className="font-bold text-sm text-gray-800">{c.nomeLoja}</p>
                            <p className="text-xs text-gray-600 mb-3">Convidou você para a equipe.</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => responderConvite(c._id, 'recusado')} 
                                className="flex-1 py-2 px-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                Recusar
                              </button>
                              <button 
                                onClick={() => responderConvite(c._id, 'aceito')} 
                                className="flex-1 py-2 px-2 bg-[#F55D22] text-white rounded-lg text-xs font-bold hover:bg-[#e04e14] transition-colors"
                              >
                                Aceitar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="font-bold text-gray-800">{user.nome}</span>

              <Link to="/conta" title="Acessar minha conta">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm hover:ring-2 hover:ring-[#F55D22] transition-all cursor-pointer">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : "?"}
                </div>
              </Link>

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
        <div className="absolute top-full left-0 right-0 bg-[#FFFBF9] border-t border-gray-100 rounded-b-xl shadow-lg flex flex-col p-4 md:hidden gap-3 z-50">
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
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-2">
                <span className="font-bold text-gray-800">Convites Pendentes</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{convites.length}</span>
              </div>
              
              <Link to="/conta" onClick={() => setMenuAberto(false)} className="w-full">
                <button className="bg-gray-100 border border-gray-200 text-gray-800 p-3 font-bold w-full rounded-xl hover:bg-gray-200 transition-colors">
                  Meu Perfil
                </button>
              </Link>

              {user.cargo === 'admin' && (
                <Link
                  to={user.hasEstablishment ? "/painel-loja" : "/cadastrar-loja"}
                  onClick={() => setMenuAberto(false)}
                  className="bg-green-600 p-3 text-white font-semibold w-full rounded-xl text-center"
                >
                  {user.hasEstablishment ? "Acessar Loja" : "Cadastrar uma Loja"}
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMenuAberto(false);
                }}
                className="bg-red-600 p-3 text-white font-semibold w-full rounded-xl hover:bg-red-700 transition-colors"
              >
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