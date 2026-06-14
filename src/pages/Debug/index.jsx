import { useState, useEffect } from "react";

function Debug() {
  const estabelecimentoId = localStorage.getItem("estabelecimentoId");
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      const res = await fetch("http://localhost:5500/produtos", {
        headers: {
          "Content-Type": "application/json",
          "x-estabelecimento-id": estabelecimentoId,
        },
      });
      if (res.ok) setProdutos(await res.json());
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-1">Área do Funcionário</h1>
      <p className="text-gray-500 mb-6">Produtos disponíveis na sua loja.</p>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="text-gray-400">Nenhum produto cadastrado na loja.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {produtos.map(p => (
            <div key={p._id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50">
              <div>
                <p className="font-bold text-gray-800">{p.nome}</p>
                <p className="text-xs text-gray-500">
                  Categoria: <span className="font-medium text-gray-700">{p.categoria}</span> |
                  Qtd: <span className="font-medium text-gray-700"> {p.quantidade}</span> |
                  Validade: <span className="font-medium text-gray-700"> {new Date(p.validade).toLocaleDateString()}</span>
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-[#F55D22] font-semibold uppercase">
                {p.tipo}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Debug;