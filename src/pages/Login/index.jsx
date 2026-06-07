import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      // ... dentro da função handleLogin no seu Login.jsx
      if (response.ok) {
        console.log("Sucesso:", data);

        // Guarda as informações de sessão essenciais
        localStorage.setItem("token", data.token);
        localStorage.setItem("cargo", data.cargo);
        localStorage.setItem("usuarioId", data.id);

        // NOVO: Verifica se o Administrador Lojista já possui uma loja associada
        if (data.email === "B@B.com" || data.cargo === "admin") {
          try {
            const resLoja = await fetch("http://localhost:5500/estabelecimento/checar", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-usuario-id": data.id // Envia o ID do admin logado
              }
            });

            const dadosLoja = await resLoja.json();

            if (dadosLoja.existe) {
              navigate("/painel-loja"); // Já tem loja, vai direto pro painel
            } else {
              navigate("/cadastrar-loja"); // Não tem loja, vai cadastrar
            }
          } catch (err) {
            console.error("Erro ao checar estabelecimento:", err);
            navigate("/cadastrar-loja");
          }
        } else {
          navigate("/pagina-cliente");
        }
      } else {
        alert(data.mensagem || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      alert("Erro ao conectar ao servidor. Verifique se o backend está ligado.");
    }
  }

  return (
    <div className="h-[92%] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-[45%] h-[150%] bg-[#f7b094] rounded-r-full -translate-y-40"></div>

      <div className="relative z-10 flex w-full max-w-7xl p-6 items-center gap-8">
        <div className="w-[50%] flex justify-center">
          <img
            src={loginImage}
            alt="Ilustração da tela de login"
            className="w-[100%]"
          />
        </div>

        <div className="w-[50%] flex justify-center">
          <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md">
            <img
              src={logoReBiteH}
              alt="Logo ReBite"
              className="w-32 mb-4 items-center justify-center mx-auto"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
              Coloque suas informações
              <br />
              para entrar
            </h2>

            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  E-mail
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Coloque o e-mail ou usuário"
                  className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  required
                />
              </div>

              <div>
                <p className="text-gray-600 text-sm">
                  Ainda não tem uma conta?{" "}
                  <a href="/cadastro" className="text-[#F55D22] font-bold">
                    Cadastre-se aqui!
                  </a>
                </p>
              </div>

              <div className="flex gap-6 mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-1/2 py-3 bg-gray-50 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;