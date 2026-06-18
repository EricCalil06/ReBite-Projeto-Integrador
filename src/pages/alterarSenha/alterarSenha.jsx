import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Shield } from "lucide-react";

export default function AlterarSenha() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar(e) {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmar) {
      alert("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmar) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      alert("A nova senha deve ter ao menos 6 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`http://localhost:5500/usuario/${user.id}/senha`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const dados = await res.json();
      if (res.ok) {
        alert("Senha alterada com sucesso!");
        navigate("/conta");
      } else {
        alert(dados.mensagem || "Não foi possível alterar a senha.");
      }
    } catch {
      alert("Erro de conexão. Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12 w-full">
      <button
        onClick={() => navigate("/conta")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8 font-medium"
      >
        ← Voltar
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Shield size={28} className="text-[#F55D22]" />
        <h1 className="text-2xl font-bold text-gray-900">Segurança e Privacidade</h1>
      </div>
      <p className="text-gray-500 mb-8">Alterar senha</p>

      <form onSubmit={handleSalvar} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Senha atual</label>
          <input
            type="password"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Nova senha</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Confirmar nova senha</label>
          <input
            type="password"
            placeholder="Repita a nova senha"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-[#F55D22] text-white font-bold py-4 rounded-full hover:bg-[#ff4800] transition-colors mt-2 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}