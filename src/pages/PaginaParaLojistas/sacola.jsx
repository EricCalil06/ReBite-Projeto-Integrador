import { useState, useEffect } from "react";

function Sacola() {
  const vendedorId = localStorage.getItem("usuarioId"); // Pega o ID do vendedor logado
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [idEmEdicao, setIdEmEdicao] = useState(null); // Controla se estamos editando ou criando

  // Carregar produtos do banco assim que a página abrir
  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      const response = await fetch(`http://localhost:5500/produtos/vendedor/${vendedorId}`);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  // Criar ou Salvar Edição de Produto
  async function handleSubmit(e) {
    e.preventDefault();

    const dadosProduto = { nome, preco: Number(preco), quantidade: Number(quantidade), vendedorId };

    try {
      if (idEmEdicao) {
        // Modo Edição (PUT)
        await fetch(`http://localhost:5500/produtos/${idEmEdicao}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosProduto),
        });
        setIdEmEdicao(null);
      } else {
        // Modo Criação (POST)
        await fetch("http://localhost:5500/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosProduto),
        });
      }

      // Limpa os campos e atualiza a lista
      setNome("");
      setPreco("");
      setQuantidade("");
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  }

  // Prepara os campos para edição
  function iniciarEdicao(produto) {
    setIdEmEdicao(produto._id);
    setNome(produto.nome);
    setPreco(produto.preco);
    setQuantidade(produto.quantidade);
  }

  // Deletar Produto
  async function deletarProduto(id) {
    if (confirm("Deseja realmente remover este produto?")) {
      try {
        await fetch(`http://localhost:5500/produtos/${id}`, { method: "DELETE" });
        buscarProdutos();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center gap-8">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {idEmEdicao ? "Editar Produto na Sacola" : "Cadastrar Produto na Sacola"}
        </h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ração Golden 10kg"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors"
          >
            {idEmEdicao ? "Salvar Alterações" : "Adicionar"}
          </button>
        </form>
      </div>

      {/* Tabela de Produtos Cadastrados */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-4xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Seus Produtos Cadastrados</h3>
        {produtos.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum produto na sacola ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Preço</th>
                  <th className="py-3 px-4">Qtd.</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto._id} className="border-b border-gray-50 text-gray-700 hover:bg-gray-50">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4">R$ {produto.preco.toFixed(2)}</td>
                    <td className="py-3 px-4">{produto.quantidade}</td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicao(produto)}
                        className="px-4 py-1 text-sm font-bold border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deletarProduto(produto._id)}
                        className="px-4 py-1 text-sm font-bold bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sacola;