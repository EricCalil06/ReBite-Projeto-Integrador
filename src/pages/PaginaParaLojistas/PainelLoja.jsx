import { useState, useEffect } from "react";

function PainelLoja() {
  const [aba, setAba] = useState("pedidos");
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const usuarioId = localStorage.getItem("usuarioId");
  const [loja, setLoja] = useState(null); 
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNomeLoja, setNovoNomeLoja] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [convites, setConvites] = useState([]);

  const [formProd, setFormProd] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    validade: "",
    categoria: "",
    tipo: "avulso",
    alertasAlergicos: "",
    descricao: "",
    imagem: "",
    peso: "",
  });
  const [formFunc, setFormFunc] = useState({ email: "" });

  const headers = {
    "Content-Type": "application/json",
    "x-usuario-id": usuarioId,
  };

  function converterDataParaISO(dataBR) {
    const [dia, mes, ano] = dataBR.split("/");
    return new Date(`${ano}-${mes}-${dia}`).toISOString();
  }

  function mascaraData(valor) {
  const nums = valor.replace(/\D/g, "").slice(0, 8);
  return nums
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  }

  function mascaraInteiro(valor) {
    return valor.replace(/\D/g, "");
  }

  function mascaraDecimal(valor) {
    let limpo = valor.replace(/[^0-9.,]/g, "");
    limpo = limpo.replace(",", ".");
    const partes = limpo.split(".");
    if (partes.length > 2) {
      limpo = partes[0] + "." + partes.slice(1).join("");
    }
    return limpo;
  }
    
  async function carregarDados() {
    try {
      if (aba === "produtos") {
        const res = await fetch("http://localhost:5500/produtos", { headers });
        if (res.ok) setProdutos(await res.json());
      }
      if (aba === "funcionarios") {
        const resFunc = await fetch(
          "http://localhost:5500/funcionarios/da-loja",
          { headers },
        );
        if (resFunc.ok) setFuncionarios(await resFunc.json());

        const resConv = await fetch("http://localhost:5500/convites/da-loja", {
          headers,
        });
        if (resConv.ok) setConvites(await resConv.json());
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function carregarPerfilLoja() {
    try {
      const res = await fetch("http://localhost:5500/estabelecimento/perfil", {
        headers: { "x-usuario-id": usuarioId },
      });
      if (res.ok) {
        const dadosLoja = await res.json();
        setLoja(dadosLoja);
        setNovoNomeLoja(dadosLoja.nome);

        carregarPedidos(dadosLoja._id);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil da loja:", err);
    }
  }

  async function carregarPedidos(estabelecimentoId) {
    const idParaBuscar =
      estabelecimentoId || (loja && loja._id) || "6a24a0b6c7eb1b3b5a1f71b5";
    try {
      const res = await fetch("http://localhost:5500/pedidos/estabelecimento", {
        headers: {
          "x-estabelecimento-id": idParaBuscar,
        },
      });

      if (res.ok) {
        const dadosPedidos = await res.json();
        setPedidos(dadosPedidos);
      }
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  }

  useEffect(() => {
    carregarDados();
    if (loja && aba === "pedidos") {
      carregarPedidos(loja._id);
    }
  }, [aba]);

  useEffect(() => {
    carregarPerfilLoja();
  }, []);

  async function handleAlterarNomeLoja(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5500/estabelecimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-usuario-id": usuarioId,
        },
        body: JSON.stringify({ nome: novoNomeLoja }),
      });

      if (response.ok) {
        setLoja((prev) => ({ ...prev, nome: novoNomeLoja }));
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
      body: JSON.stringify(formProd),
    });
    setFormProd({
      nome: "",
      preco: "",
      quantidade: "",
      validade: "",
      categoria: "",
      tipo: "avulso",
      alertasAlergicos: "",
      descricao: "",
      imagem: "",
      validade: converterDataParaISO(formProd.validade),
    });
    carregarDados();
  }

  async function salvarFuncionario(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5500/convites/enviar", {
        method: "POST",
        headers,
        body: JSON.stringify({ emailColaborador: formFunc.email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Convite enviado com sucesso!");
        setFormFunc({ email: "" });
        carregarDados();
      } else {
        alert(data.error || "Erro ao enviar convite.");
      }
    } catch (err) {
      console.error("Erro ao enviar convite:", err);
      alert("Erro ao conectar ao servidor.");
    }
  }

  async function removerFuncionario(id) {
    if (!confirm("Deseja remover este funcionário? Ele voltará a ser cliente."))
      return;

    try {
      const res = await fetch(
        `http://localhost:5500/funcionarios/da-loja/${id}`,
        {
          method: "DELETE",
          headers,
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Funcionário removido com sucesso.");
        carregarDados();
      } else {
        alert(data.error || "Erro ao remover funcionário.");
      }
    } catch (err) {
      console.error("Erro ao remover funcionário:", err);
      alert("Erro ao conectar ao servidor.");
    }
  }

  async function cancelarConvite(id) {
    if (!confirm("Deseja cancelar este convite?")) return;

    try {
      const res = await fetch(`http://localhost:5500/convites/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        carregarDados();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao cancelar convite.");
      }
    } catch (err) {
      console.error("Erro ao cancelar convite:", err);
      alert("Erro ao conectar ao servidor.");
    }
  }

  async function deletarItem(rota, id) {
    await fetch(`http://localhost:5500/${rota}/${id}`, { method: "DELETE" });
    carregarDados();
  }

  const pedidosDeHoje = pedidos.filter((pedido) => {
    const dataPedido = new Date(pedido.createdAt).toLocaleDateString("pt-BR");
    const dataHoje = new Date().toLocaleDateString("pt-BR");
    return dataPedido === dataHoje;
  });

  const pedidosPendentes = pedidos.filter(
    (pedido) => pedido.status === "Pendente",
  );

  const valorTotalGeral = pedidos.reduce(
    (acc, pedido) => acc + (pedido.total || 0),
    0,
  );

  async function atualizarStatus(pedidoId, novoStatus) {
  try {
    const res = await fetch(`http://localhost:5500/pedidos/${pedidoId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    if (res.ok) carregarPedidos(loja._id);
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
  }
}

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans flex flex-col w-full overflow-x-hidden">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-12 py-4 flex justify-between items-center relative w-full z-50">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => setAba("pedidos")}
              className={`font-semibold text-sm lg:text-base whitespace-nowrap ${aba === "pedidos" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Pedidos da Loja
            </button>
            <button
              onClick={() => setAba("produtos")}
              className={`font-semibold text-sm lg:text-base whitespace-nowrap ${aba === "produtos" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Produtos/Sacolas
            </button>
            <button
              onClick={() => setAba("funcionarios")}
              className={`font-semibold text-sm lg:text-base whitespace-nowrap ${aba === "funcionarios" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Funcionários
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800"></p>
            <p className="text-xs text-[#F55D22]"></p>
          </div>
          <div></div>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 text-gray-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuAberto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {menuAberto && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 flex flex-col p-4 shadow-lg md:hidden z-50">
            <button
              onClick={() => {
                setAba("pedidos");
                setMenuAberto(false);
              }}
              className={`py-3 text-left font-semibold border-b border-gray-50 ${aba === "pedidos" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Painel do Estabelecimento
            </button>
            <button
              onClick={() => {
                setAba("produtos");
                setMenuAberto(false);
              }}
              className={`py-3 text-left font-semibold border-b border-gray-50 ${aba === "produtos" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Produtos/Sacolas
            </button>
            <button
              onClick={() => {
                setAba("funcionarios");
                setMenuAberto(false);
              }}
              className={`py-3 text-left font-semibold ${aba === "funcionarios" ? "text-[#F55D22]" : "text-gray-600"}`}
            >
              Funcionários
            </button>
          </div>
        )}
      </nav>

      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-6 md:py-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow-sm w-full">
        <div className="w-full md:w-auto">
          {editandoNome ? (
            <form
              onSubmit={handleAlterarNomeLoja}
              className="flex flex-wrap items-center gap-3 w-full"
            >
              <input
                type="text"
                value={novoNomeLoja}
                onChange={(e) => setNovoNomeLoja(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-lg md:text-xl font-bold text-gray-800 min-w-[200px] flex-1 sm:flex-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-bold rounded-full text-xs hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditandoNome(false);
                    setNovoNomeLoja(loja?.nome || "");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-full text-xs hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 break-words max-w-full">
                {loja ? loja.nome : "Carregando..."}
              </h1>
              <button
                onClick={() => setEditandoNome(true)}
                className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full hover:bg-gray-200 font-medium transition-colors whitespace-nowrap"
              >
                Editar Nome
              </button>
            </div>
          )}
          <p className="text-gray-400 text-sm mt-1">
            Painel de Controle do Administrador
          </p>
        </div>

        <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 self-start md:self-auto">
          Cargo: Lojista Admin
        </div>
      </div>

      <div className="flex flex-1 p-10 gap-8">
        {aba === "pedidos" && (
          <div className="w-full flex flex-col gap-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-sm">Pedidos de hoje</span>
                <span className="text-3xl font-bold text-[#F55D22]">{pedidosDeHoje.length}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-sm">Pedidos pendentes</span>
                <span className="text-3xl font-bold text-[#F55D22]">{pedidosPendentes.length}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-sm">Valor total dos pedidos</span>
                <span className="text-3xl font-bold text-[#F55D22]">
                  R$ {valorTotalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* PENDENTES */}
            <h2 className="font-bold text-gray-800 text-lg mt-2">Pedidos Pendentes</h2>
            {pedidos.filter(p => p.status === "Pendente").length === 0 ? (
              <p className="text-gray-400 text-sm italic">Nenhum pedido pendente.</p>
            ) : (
              pedidos.filter(p => p.status === "Pendente").map(pedido => (
                <div key={pedido._id} className="p-5 bg-white border border-amber-100 rounded-2xl shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">ID: #{pedido._id.slice(-6).toUpperCase()}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">Pendente</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium mt-2">
                      {pedido.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ")}
                    </div>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-right flex flex-col gap-2 items-end">
                    <span className="text-base font-bold text-gray-800">R$ {pedido.total.toFixed(2)}</span>
                    <button
                      onClick={() => atualizarStatus(pedido._id, "Preparando")}
                      className="bg-[#F55D22] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#ff4800] transition-colors"
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* EM PREPARO */}
            <h2 className="font-bold text-gray-800 text-lg mt-2">Em Preparo</h2>
            {pedidos.filter(p => p.status === "Preparando").length === 0 ? (
              <p className="text-gray-400 text-sm italic">Nenhum pedido em preparo.</p>
            ) : (
              pedidos.filter(p => p.status === "Preparando").map(pedido => (
                <div key={pedido._id} className="p-5 bg-white border border-blue-100 rounded-2xl shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">ID: #{pedido._id.slice(-6).toUpperCase()}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">Preparando</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium mt-2">
                      {pedido.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ")}
                    </div>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-right flex flex-col gap-2 items-end">
                    <span className="text-base font-bold text-gray-800">R$ {pedido.total.toFixed(2)}</span>
                    <button
                      onClick={() => atualizarStatus(pedido._id, "Pronto")}
                      className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                    >
                      Marcar como Pronto
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* PRONTOS */}
            <h2 className="font-bold text-gray-800 text-lg mt-2">Prontos para Retirada</h2>
            {pedidos.filter(p => p.status === "Pronto").length === 0 ? (
              <p className="text-gray-400 text-sm italic">Nenhum pedido pronto.</p>
            ) : (
              pedidos.filter(p => p.status === "Pronto").map(pedido => (
                <div key={pedido._id} className="p-5 bg-white border border-green-100 rounded-2xl shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">ID: #{pedido._id.slice(-6).toUpperCase()}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">Pronto</span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium mt-2">
                      {pedido.itens.map(item => `${item.quantidade}x ${item.nome}`).join(", ")}
                    </div>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-800">R$ {pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {aba === "produtos" && (
          <div className="w-full grid grid-cols-3 gap-8">
            <form
              onSubmit={salvarProduto}
              className="bg-white p-6 rounded-2xl border h-fit flex flex-col gap-4"
            >
              <h2 className="font-bold text-gray-800 text-lg">
  Adicionar Item ao Catálogo
</h2>
<input
  type="text"
  placeholder="Nome do Produto"
  value={formProd.nome}
  onChange={(e) =>
    setFormProd({ ...formProd, nome: e.target.value })
  }
  className="border p-2 rounded-xl"
  required
/>
<input
  type="text"
  placeholder="Descrição"
  value={formProd.descricao}
  onChange={(e) =>
    setFormProd({ ...formProd, descricao: e.target.value })
  }
  className="border p-2 rounded-xl"
/>

<div className="grid grid-cols-2 gap-2">
  <input
    type="text"
    inputMode="decimal"
    placeholder="Preço"
    value={formProd.preco}
    onChange={(e) =>
      setFormProd({ ...formProd, preco: mascaraDecimal(e.target.value) })
    }
    className="border p-2 rounded-xl"
    required
  />
  <input
    type="text"
    inputMode="numeric"
    placeholder="Qtd"
    value={formProd.quantidade}
    onChange={(e) =>
      setFormProd({ ...formProd, quantidade: mascaraInteiro(e.target.value) })
    }
    className="border p-2 rounded-xl"
    required
  />
</div>

<input
  type="text"
  inputMode="numeric"
  placeholder="Validade (DD/MM/AAAA)"
  value={formProd.validade}
  onChange={(e) =>
    setFormProd({ ...formProd, validade: mascaraData(e.target.value) })
  }
  className="border p-2 rounded-xl"
  required
/>
<input
  type="text"
  placeholder="Categoria (Ex: Padaria, Pet)"
  value={formProd.categoria}
  onChange={(e) =>
    setFormProd({ ...formProd, categoria: e.target.value })
  }
  className="border p-2 rounded-xl"
  required
/>
<input
  type="text"
  placeholder="Alertas Alérgicos"
  value={formProd.alertasAlergicos}
  onChange={(e) =>
    setFormProd({ ...formProd, alertasAlergicos: e.target.value })
  }
  className="border p-2 rounded-xl"
/>

<input
  type="text"
  inputMode="decimal"
  placeholder="Peso em kg (Ex: 0.5)"
  value={formProd.peso}
  onChange={(e) =>
    setFormProd({ ...formProd, peso: mascaraDecimal(e.target.value) })
  }
  className="border p-2 rounded-xl"
/>
              <select
                value={formProd.tipo}
                onChange={(e) =>
                  setFormProd({ ...formProd, tipo: e.target.value })
                }
                className="border p-2 rounded-xl bg-white"
              >
                <option value="avulso">Produto Avulso</option>
                <option value="sacola_surpresa">Sacola Surpresa</option>
              </select>

              <input
                type="text"
                placeholder="URL da Imagem (Ex: public/banana.jpg)"
                value={formProd.imagem}
                onChange={(e) =>
                  setFormProd({ ...formProd, imagem: e.target.value })
                }
                className="border p-2 rounded-xl text-sm"
              />

              <button className="bg-[#F55D22] text-white py-2 rounded-xl font-bold">
                Cadastrar Produto
              </button>
            </form>

            <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl border w-full">
              <h2 className="font-bold text-lg mb-4">Catálogo Ativo</h2>
              <div className="flex flex-col gap-3 w-full">
                {produtos.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">
                    Nenhum produto cadastrado no momento.
                  </p>
                ) : (
                  produtos.map((p) => (
                    <div
                      key={p._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:bg-gray-50 gap-4 w-full transition-all"
                    >
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold text-gray-800 text-sm md:text-base break-words max-w-[70%]">
                            {p.nome}
                          </p>
                          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#F55D22] font-semibold uppercase">
                            {p.tipo}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed break-words">
                          Categoria:{" "}
                          <span className="font-medium text-gray-700">
                            {p.categoria}
                          </span>{" "}
                          | Qtd:{" "}
                          <span className="font-medium text-gray-700">
                            {" "}
                            {p.quantidade}{" "}
                          </span>{" "}
                          | Validade:{" "}
                          <span className="font-medium text-gray-700">
                            {" "}
                            {new Date(p.validade).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => deletarItem("produtos", p._id)}
                        className="text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition-colors self-end sm:self-auto w-full sm:w-auto text-center"
                      >
                        Remover
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {aba === "funcionarios" && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <form
                onSubmit={salvarFuncionario}
                className="bg-white p-4 md:p-6 rounded-2xl border flex flex-col gap-4 w-full sticky top-4"
              >
                <h2 className="font-bold text-gray-800 text-lg">
                  Convidar Colaborador
                </h2>
                <p className="text-sm text-gray-500">
                  Informe o e-mail de um usuário para enviar um convite de
                  acesso à loja.
                </p>
                <input
                  type="email"
                  placeholder="E-mail do usuário"
                  value={formFunc.email}
                  onChange={(e) => setFormFunc({ email: e.target.value })}
                  className="border p-3 rounded-xl w-full text-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
                  required
                />
                <button className="bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors mt-2 text-sm">
                  Enviar Convite
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              {convites.length > 0 && (
                <div className="bg-white p-4 md:p-6 rounded-2xl border w-full">
                  <h2 className="font-bold text-lg mb-4 text-[#F55D22]">
                    Convites Pendentes
                  </h2>
                  <div className="flex flex-col gap-3 w-full">
                    {convites.map((c) => (
                      <div
                        key={c._id}
                        className="flex justify-between items-center p-4 border border-orange-100 bg-orange-50 rounded-xl gap-4 w-full"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-700 text-sm md:text-base break-words">
                            {c.emailColaborador}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Aguardando aceite...
                          </p>
                        </div>
                        <button
                          onClick={() => cancelarConvite(c._id)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs bg-white px-3 py-2 rounded-lg transition-colors border border-red-100"
                        >
                          Cancelar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-4 md:p-6 rounded-2xl border w-full">
                <h2 className="font-bold text-lg mb-4">
                  Quadro de Funcionários
                </h2>
                <div className="flex flex-col gap-3 w-full">
                  {funcionarios.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">
                      Nenhum funcionário registrado.
                    </p>
                  ) : (
                    funcionarios.map((f) => (
                      <div
                        key={f._id}
                        className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 gap-4 w-full transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-700 text-sm md:text-base break-words">
                            {f.nome}
                          </p>
                          <p className="text-xs text-gray-400">
                            {f.email} · {f.telefone}
                          </p>
                        </div>
                        <button
                          onClick={() => removerFuncionario(f._id)}
                          className="text-red-400 hover:text-red-600 font-medium text-xs bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PainelLoja;
