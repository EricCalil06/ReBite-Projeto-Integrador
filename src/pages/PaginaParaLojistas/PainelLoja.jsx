import { useState, useEffect } from "react";
import logoReBiteH from "../../assets/logoReBiteH.png";

function PainelLoja() {
  const [aba, setAba] = useState("pedidos");
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const usuarioId = localStorage.getItem("usuarioId");
  const [loja, setLoja] = useState({ nome: "Carregando..." });
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNomeLoja, setNovoNomeLoja] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");

  const [formProd, setFormProd] = useState({ 
  nome: "", preco: "", quantidade: "", validade: "", 
  categoria: "", tipo: "avulso", alertasAlergicos: "", 
  descricao: "", imagem: ""
  });
  const [formFunc, setFormFunc] = useState({ nome: "", funcao: "Colaborador" });

  const headers = { "Content-Type": "application/json", "x-usuario-id": usuarioId };

  useEffect(() => {
    carregarDados();
  }, [aba]);

  

  async function carregarDados() {
    if (!usuarioId) return;
    
    try {
      const resPerfil = await fetch("http://localhost:5500/estabelecimento/perfil", { headers });
      if (resPerfil.ok) {
        const dadosPerfil = await resPerfil.json();
        setNomeLoja(dadosPerfil.nome);
        setNovoNomeLoja(dadosPerfil.nome);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil da loja:", err);
    }

    try {
      const resP = await fetch("http://localhost:5500/produtos", { headers });
      if (resP.ok) {
        const dataP = await resP.json();
        setProdutos(dataP);
      }

      const resF = await fetch("http://localhost:5500/funcionarios", { headers });
      if (resF.ok) {
        const dataF = await resF.json();
        setFuncionarios(dataF);
      }
    } catch (err) {
      console.error("Erro ao carregar listas do catálogo:", err);
    }
  } 

async function handleAlterarNomeLoja() {
  try {
    const response = await fetch("http://localhost:5500/estabelecimento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-usuario-id": usuarioId 
      },
      body: JSON.stringify({ nome: novoNomeLoja }) 
    });

    if (response.ok) {
      setNomeLoja(novoNomeLoja); 
      setEditandoNome(false);    
      alert("Nome do estabelecimento atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar o nome do estabelecimento.");
    }
  } catch (err) {
    console.error("Erro ao salvar nome:", err);
  }
}

  async function salvarProduto(e) {
    e.preventDefault();
    await fetch("http://localhost:5500/produtos", {
      method: "POST",
      headers,
      body: JSON.stringify(formProd)
    });
    setFormProd({ nome: "", preco: "", quantidade: "", validade: "", categoria: "", tipo: "avulso", alertasAlergicos: "", descricao: "" });
    carregarDados();
  }

  async function salvarFuncionario(e) {
    e.preventDefault();
    await fetch("http://localhost:5500/funcionarios", {
      method: "POST",
      headers,
      body: JSON.stringify(formFunc)
    });
    setFormFunc({ nome: "", funcao: "Colaborador" });
    carregarDados();
  }

  async function deletarItem(rota, id) {
    await fetch(`http://localhost:5500/${rota}/${id}`, { method: "DELETE" });
    carregarDados();
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans flex flex-col">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-gray-100 px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img src={logoReBiteH} alt="Logo" className="w-24" />
          <span className="text-gray-400">|</span>
          <button onClick={() => setAba("pedidos")} className={`font-semibold ${aba === 'pedidos' ? 'text-[#F55D22]' : 'text-gray-600'}`}>Painel do Estabelecimento</button>
          <button onClick={() => setAba("produtos")} className={`font-semibold ${aba === 'produtos' ? 'text-[#F55D22]' : 'text-gray-600'}`}>Produtos/Sacolas</button>
          <button onClick={() => setAba("funcionarios")} className={`font-semibold ${aba === 'funcionarios' ? 'text-[#F55D22]' : 'text-gray-600'}`}>Funcionários</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">B@B.com</p>
            <p className="text-xs text-[#F55D22]">Administrador Lojista</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </nav>

      {/* Cabeçalho do Painel */}
      <div className="bg-white border-b border-gray-100 px-12 py-8 flex justify-between items-center shadow-sm">
        <div>
          {editandoNome ? (
            <form onSubmit={handleAlterarNomeLoja} className="flex items-center gap-3">
              <input
                type="text"
                value={novoNomeLoja}
                onChange={(e) => setNovoNomeLoja(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-xl font-bold text-gray-800"
                required
              />
              <button type="submit" className="px-4 py-2 bg-green-600 text-white font-bold rounded-full text-xs hover:bg-green-700 transition-colors">
                Salvar
              </button>
              <button type="button" onClick={() => { setEditandoNome(false); setNovoNomeLoja(nomeLoja); }} className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-full text-xs hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {nomeLoja || "Minha Loja"}
              </h1>
              <button onClick={() => setEditandoNome(true)} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full hover:bg-gray-200 font-medium transition-colors">
                 Editar Nome
              </button>
            </div>
          )}
          <p className="text-gray-400 text-sm mt-1">Painel de Controle do Administrador</p>
        </div>

        <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          Cargo: Lojista Admin 
        </div>
      </div>

      <div className="flex flex-1 p-10 gap-8">
        {/* Aba de Pedidos */}
        {aba === "pedidos" && (
          <div className="w-full flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Painel da loja</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-semibold">Pedidos de hoje</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">30</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-semibold">Pedidos pendentes</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">22</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 font-semibold">Valor total dos pedidos</p>
                <p className="text-3xl font-bold text-[#F55D22] mt-2">R$ 1.095</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Pedidos Recentes</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b pb-2">
                    <th className="pb-3">Nº</th>
                    <th className="pb-3">Nome</th>
                    <th className="pb-3">Itens</th>
                    <th className="pb-3">Valor total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 font-semibold text-gray-400">#235</td>
                      <td className="py-3">José de Carvalho</td>
                      <td className="py-3 text-gray-400">x2</td>
                      <td className="py-3 font-medium">R$ 159,90</td>
                      <td className="py-3 text-orange-500 font-semibold">Pendente</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aba CRUD de Produtos */}
        {aba === "produtos" && (
          <div className="w-full grid grid-cols-3 gap-8">
            <form onSubmit={salvarProduto} className="bg-white p-6 rounded-2xl border h-fit flex flex-col gap-4">
              <h2 className="font-bold text-gray-800 text-lg">Adicionar Item ao Catálogo</h2>
              <input type="text" placeholder="Nome do Produto" value={formProd.nome} onChange={e => setFormProd({...formProd, nome: e.target.value})} className="border p-2 rounded-xl" required />
              <input type="text" placeholder="Descrição" value={formProd.descricao} onChange={e => setFormProd({...formProd, descricao: e.target.value})} className="border p-2 rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Preço" value={formProd.preco} onChange={e => setFormProd({...formProd, preco: e.target.value})} className="border p-2 rounded-xl" required />
                <input type="number" placeholder="Qtd" value={formProd.quantidade} onChange={e => setFormProd({...formProd, quantidade: e.target.value})} className="border p-2 rounded-xl" required />
              </div>
              <input type="date" value={formProd.validade} onChange={e => setFormProd({...formProd, validade: e.target.value})} className="border p-2 rounded-xl" required />
              <input type="text" placeholder="Categoria (Ex: Padaria, Pet)" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})} className="border p-2 rounded-xl" required />
              <input type="text" placeholder="Alertas Alérgicos" value={formProd.alertasAlergicos} onChange={e => setFormProd({...formProd, alertasAlergicos: e.target.value})} className="border p-2 rounded-xl" />
              <select value={formProd.tipo} onChange={e => setFormProd({...formProd, tipo: e.target.value})} className="border p-2 rounded-xl bg-white">
                <option value="avulso">Produto Avulso</option>
                <option value="sacola_surpresa">Sacola Surpresa </option>
                <input
                  type="text"
                  placeholder="public/banana.jpg"
                  value={formProd.imagem}
                  onChange={e => setFormProd({ ...formProd, imagem: e.target.value })}
                  className="border p-2 rounded-xl text-sm"
                />
              </select>
              <button className="bg-[#F55D22] text-white py-2 rounded-xl font-bold">Cadastrar Produto</button>
            </form>

            <div className="col-span-2 bg-white p-6 rounded-2xl border">
              <h2 className="font-bold text-lg mb-4">Catálogo Ativo</h2>
              <div className="flex flex-col gap-2">
                {produtos.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-800">{p.nome} <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#F55D22] font-normal">{p.tipo}</span></p>
                      <p className="text-xs text-gray-400">Categoria: {p.categoria} | Qtd: {p.quantidade} | Validade: {new Date(p.validade).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deletarItem('produtos', p._id)} className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">Remover</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba CRUD de Funcionários */}
        {aba === "funcionarios" && (
          <div className="w-full grid grid-cols-3 gap-8">
            <form onSubmit={salvarFuncionario} className="bg-white p-6 rounded-2xl border h-fit flex flex-col gap-4">
              <h2 className="font-bold text-gray-800 text-lg">Registrar Funcionário</h2>
              <input type="text" placeholder="Nome Completo" value={formFunc.nome} onChange={e => setFormFunc({...formFunc, nome: e.target.value})} className="border p-2 rounded-xl" required />
              <select value={formFunc.funcao} onChange={e => setFormFunc({...formFunc, funcao: e.target.value})} className="border p-2 rounded-xl bg-white">
                <option value="Colaborador">Colaborador</option>
                <option value="Repositor">Repositor</option>
                <option value="ADM">ADM</option>
              </select>
              <button className="bg-gray-800 text-white py-2 rounded-xl font-bold">Adicionar Membro</button>
            </form>

            <div className="col-span-2 bg-white p-6 rounded-2xl border">
              <h2 className="font-bold text-lg mb-4">Quadro de Funcionários</h2>
              <div className="flex flex-col gap-2">
                {funcionarios.map(f => (
                  <div key={f._id} className="flex justify-between items-center p-3 border rounded-xl">
                    <p className="font-bold text-gray-700">{f.nome} — <span className="text-gray-400 text-sm font-normal">{f.funcao}</span></p>
                    <button onClick={() => deletarItem('funcionarios', f._id)} className="text-red-400 hover:text-red-600 text-sm">Remover</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PainelLoja;