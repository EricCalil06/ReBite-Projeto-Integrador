import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoReBiteH from "../../assets/logoReBiteH.png";

function CadastrarLoja() {
  const [nomeLoja, setNomeLoja] = useState("");
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuarioId");

  async function handleCadastroLoja(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5500/estabelecimento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-usuario-id": usuarioId
      },
      body: JSON.stringify({ nome: nomeLoja }) // Envia o nome digitado na tela
    });
    
    try {
      const response = await fetch("http://localhost:5500/funcionarios", { 
        method: "GET", 
        headers: { "x-usuario-id": usuarioId } 
      });

      if (response.ok) {
        navigate("/painel-loja");
      }
    } catch (error) {
      console.error("Erro ao registrar estabelecimento:", error);
      alert("Houve um problema ao salvar os dados da sua loja.");
    }
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md border border-gray-100">
        <img
          src={logoReBiteH}
          alt="Logo ReBite"
          className="w-32 mb-6 mx-auto"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Configure seu Estabelecimento
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Identificamos que seu perfil de Administrador ainda não possui uma loja ativa vinculada.
        </p>

        <form onSubmit={handleCadastroLoja} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nome da Loja / Franquia
            </label>
            <input
              type="text"
              value={nomeLoja}
              onChange={(e) => setNomeLoja(e.target.value)}
              placeholder="Ex: Padaria do seu Jorge"
              className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors mt-2"
          >
            Concluir e Abrir Painel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastrarLoja;