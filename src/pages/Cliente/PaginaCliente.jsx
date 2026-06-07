import { useState, useEffect } from "react";
import logoReBiteH from "../../assets/logoReBiteH.png";

function PaginaCliente() {
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados para o Modal de Denúncia
  const [modalAberto, setModalAberto] = useState(false);
  const [motivoDenancia, setMotivoDenuncia] = useState("");
  const [descricaoDenuncia, setDescricaoDenuncia] = useState("");

  // Recupera o ID do usuário logado (cliente)
  const usuarioId = localStorage.getItem("usuarioId") || "6657c8b4f2c52923c64390f0";

  useEffect(() => {
    carregarDadosLoja();
  }, []);

async function carregarDadosLoja() {
    try {
      // 1. ID do estabelecimento copiado direto do seu documento do banco de dados
      const idEstabelecimentoAlvo = "6a24a0b6c7eb1b3b5a1f71b5"; 
      
      // ID do dono (usuário B@B.com) para buscar o perfil da loja
      const idAdminDono = "6a24a100c7eb1b3b5a1f71b9"; // O ID correspondente ao B@B.com se necessário, ou mantenha o idEstabelecimentoAlvo se a rota aceitar

      // 2. Busca os produtos enviando o ID do estabelecimento no cabeçalho customizado
      const resProd = await fetch("http://localhost:5500/produtos", {
        headers: {
          "x-estabelecimento-id": idEstabelecimentoAlvo // Passa o ID para o backend filtrar
        }
      });
      const dadosProd = await resProd.json();
      
      if (Array.isArray(dadosProd)) {
        setProdutos(dadosProd);
      } else {
        setProdutos([]);
      }

      // 3. Busca o perfil do estabelecimento para renderizar o nome da loja
      const resPerfil = await fetch("http://localhost:5500/estabelecimento/perfil", {
        headers: { 
          "x-usuario-id": idEstabelecimentoAlvo // Se a rota do perfil pedir o ID da loja, use este
        }
      });
      
      if (resPerfil.ok) {
        const dadosLoja = await resPerfil.json();
        setLoja(dadosLoja);
      }
    } catch (err) {
      console.error("Erro ao carregar dados para o cliente:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function enviarDenuncia(e) {
    e.preventDefault();
    if (!loja) return;

    try {
      const response = await fetch("http://localhost:5500/denuncias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estabelecimentoId: loja._id,
          usuarioDenuncianteId: usuarioId,
          motivo: motivoDenancia,
          descricaoDetalhada: descricaoDenuncia
        })
      });

      if (response.ok) {
        setModalAberto(false);
        setMotivoDenuncia("");
        setDescricaoDenuncia("");
        alert("Denúncia enviada com sucesso!");
      } else {
        alert("Erro ao enviar denúncia.");
      }
    } catch (err) {
      console.error("Erro ao processar denúncia:", err);
    }
  }

  if (carregando) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Carregando catálogo da loja...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans">
      {/* Navbar do Cliente */}
      <nav className="bg-white border-b border-gray-100 px-12 py-4 flex justify-between items-center">
        <img src={logoReBiteH} alt="Logo ReBite" className="w-24" />
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600 font-medium">Área do Cliente</span>
          <div className="w-10 h-10 bg-[#F55D22] text-white rounded-full flex items-center justify-center font-bold">
            C
          </div>
        </div>
      </nav>

      {/* Banner da Loja */}
      <div className="bg-white border-b border-gray-100 px-12 py-8 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {loja?.nome || "Carregando Estabelecimento..."}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Conheça nossos produtos e sacolas surpresas disponíveis
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold rounded-full text-sm transition-colors flex items-center gap-2"
        >
          Denunciar Loja
        </button>
      </div>

      {/* Grid de Produtos */}
      <div className="p-12 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Cardápio / Catálogo Disponível</h2>

        {produtos.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Nenhum item disponível nesta loja no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                
                {/* Bloco da Imagem do Produto (CORRIGIDO) */}
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-50">
                  {p.imagem ? (
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500";
                      }}
                    />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                </div>

                {/* Detalhes do Produto */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{p.nome}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        p.tipo === 'sacola_surpresa' ? 'bg-orange-100 text-[#F55D22]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.tipo === 'sacola_surpresa' ? 'Sacola Surpresa' : 'Item Avulso'}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {p.descricao || "Sem descrição disponível."}
                    </p>

                    {p.alertasAlergicos && (
                      <div className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-xl mb-4">
                        <strong>Alérgicos:</strong> {p.alertasAlergicos}
                      </div>
                    )}
                  </div>

                  {/* Preço e Botão */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                    <div>
                      <p className="text-xs text-gray-400">Preço</p>
                      <p className="text-xl font-black text-gray-800">R$ {p.preco?.toFixed(2)}</p>
                    </div>
                    <button className="px-4 py-2 bg-[#F55D22] text-white text-sm font-bold rounded-full hover:bg-[#ff4800] transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE DENÚNCIA */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Registrar Reclamação / Denúncia</h2>
            <p className="text-xs text-gray-400 mb-6">Sua identidade ficará em sigilo e a equipe REBITE auditará o local.</p>

            <form onSubmit={enviarDenuncia} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Motivo Principal</label>
                <input
                  type="text"
                  placeholder="Ex: Produto vencido, propaganda enganosa"
                  value={motivoDenancia}
                  onChange={(e) => setMotivoDenuncia(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Relato Detalhado</label>
                <textarea
                  placeholder="Descreva o que aconteceu de forma clara..."
                  value={descricaoDenuncia}
                  onChange={(e) => setDescricaoDenuncia(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm h-28"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors"
                >
                  Confirmar Denúncia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginaCliente;