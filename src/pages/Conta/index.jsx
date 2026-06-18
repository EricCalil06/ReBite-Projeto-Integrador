import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { UserX, Shield, CreditCard, ChevronDown, LogOut } from "lucide-react";
import { User } from "lucide-react";

export default function Conta() {
  const [openFaq, setOpenFaq] = useState(null);
  const [temLoja, setTemLoja] = useState(null);
  const [kgSalvos, setKgSalvos] = useState("0");
  
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const faqData = [
    { question: "Minha entrega não veio certo, o que eu posso fazer?" },
    { question: "Como eu faço para pagar as minhas compras?" },
    { question: "Onde eu vejo os métodos de entrega da loja?" },
    { question: "Perdi a senha da minha conta. O que eu posso fazer?" },
    { question: "Para que serve o código de segurança nas entregas?" },
  ];

  useEffect(() => {
    if (user?.id) {
      buscarKgs();
      if (user?.cargo === "admin") checarLoja();
    }
  }, [user]);

  async function buscarKgs() {
    try {
      const res = await fetch(`http://localhost:5500/pedidos/usuario/${user.id}/kgs`);
      if (res.ok) {
        const dados = await res.json();
        setKgSalvos(dados.totalKg);
      }
    } catch (err) {
      console.error("Erro ao buscar kg salvos:", err);
    }
  }

  async function checarLoja() {
    try {
      const res = await fetch("http://localhost:5500/estabelecimento/checar", {
        headers: { "x-usuario-id": user.id }
      });
      if (res.ok) {
        const dados = await res.json();
        setTemLoja(dados.existe);
      }
    } catch (err) {
        console.error("Erro ao checar estabelecimento:", err);
        setTemLoja(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    setUser(null);
    navigate("/");
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-sm max-w-md w-full text-center flex flex-col items-center">
          <UserX size={64} className="text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Você não está logado</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Para acessar seus dados, acompanhar seus pedidos e aproveitar as ofertas, faça login na sua conta.
          </p>
          
          <button 
            onClick={() => navigate("/login")}
            className="w-full bg-[#F55D22] text-white font-bold py-4 rounded-full mb-4 hover:bg-[#ff4800] transition-colors"
          >
            Fazer Login
          </button>
          
          <button 
            onClick={() => navigate("/cadastro")}
            className="w-full bg-gray-100 text-gray-900 font-bold py-4 rounded-full hover:bg-gray-200 transition-colors"
          >
            Ainda não tenho conta
          </button>
        </div>
      </div>
    );
  }

  let botaoTexto = "";
  let botaoRota = "";
  let mostrarBotao = false;

  if (user?.cargo === "funcionario") {
    mostrarBotao = true;
    botaoTexto = "Acessar painel da loja";
    botaoRota = "/painel-loja";
  } else if (user?.cargo === "cliente") {
    mostrarBotao = true;
    botaoTexto = "Cadastrar uma loja";
    botaoRota = "/cadastro-lojista";
  } else if (user?.cargo === "admin" && temLoja !== null) {
    mostrarBotao = true;
    botaoTexto = temLoja ? "Acessar painel da loja" : "Cadastrar uma loja";
    botaoRota = temLoja ? "/painel-loja" : "/cadastro-lojista";
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center border border-gray-100">
            <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center">
              <User className="w-12 h-12 text-black" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Bem-vindo!</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{user.nome || "Usuário"}</h1>
            
            <div className="w-full bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <span className="block text-sm text-gray-600 mb-1">Você economizou até agora:</span>
              <span className="block text-2xl font-black text-[#F55D22]">{kgSalvos}kg de Alimento</span>
            </div>
          </div>

          {mostrarBotao && (
            <button
              onClick={() => navigate(botaoRota)}
              className="w-full bg-[#F55D22] text-white font-bold py-4 rounded-2xl hover:bg-[#ff4800] transition-colors shadow-sm"
            >
              {botaoTexto}
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair da conta
          </button>
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações</h2>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => navigate("/alterar-senha")}
                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
              >
                <Shield size={24} className="text-gray-700" />
                <span className="text-base font-medium text-gray-900">Segurança e Privacidade</span>
              </button>
              <div className="h-px bg-gray-200 w-full"></div>
              <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
                <CreditCard size={24} className="text-gray-700" />
                <span className="text-base font-medium text-gray-900">Dados do Perfil</span>
              </button>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Precisa de ajuda?</h2>
              <p className="text-sm text-gray-600">Confira o nosso FAQ e veja se sua dúvida está aqui</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col divide-y divide-gray-200">
              {faqData.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-sm font-medium text-gray-900 pr-4">{item.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-sm text-gray-600">
                      Esta é uma resposta temporária para a sua pergunta. O suporte entrará em contato em breve se necessário.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <p className="text-center text-sm text-gray-500 mt-4">
            Não encontrou sua dúvida no FAQ?{" "}
            <a href="#" className="text-[#F55D22] font-semibold hover:underline">Clique aqui</a>
            {" "}e fale com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
}