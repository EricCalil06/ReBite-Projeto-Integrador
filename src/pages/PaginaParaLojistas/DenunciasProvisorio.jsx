import { useState, useEffect } from "react";

function DenunciasProvisorio() {
  const [denuncias, setDenuncias] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    carregarDenuncias();
  }, []);

  async function carregarDenuncias() {
    const res = await fetch("http://localhost:5500/denuncias");
    const data = await res.json();
    setDenuncias(data);
  }

  async function enviarDenuncia(e) {
    e.preventDefault();
    // Simulando denúncia enviada pelo usuário logado para o primeiro estabelecimento ativo
    await fetch("http://localhost:5500/denuncias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estabelecimentoId: "6657c8b4f2c52923c64390f4", // Mock provisório de ID
        usuarioDenuncianteId: localStorage.getItem("usuarioId") || "69fbb2c52923c64390f3d9fc",
        motivo,
        descricaoDetalhada: descricao
      })
    });
    setMotivo("");
    setDescricao("");
    carregarDenuncias();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10 flex flex-col gap-8">
      <div className="max-w-4xl w-full mx-auto bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <h1 className="text-xl font-bold text-red-400 mb-4">🚨 Módulo do Sistema: Denúncias & Auditoria</h1>
        
        <form onSubmit={enviarDenuncia} className="flex flex-col gap-3">
          <input type="text" placeholder="Motivo da Denúncia" value={motivo} onChange={e => setMotivo(e.target.value)} className="bg-gray-700 border border-gray-600 p-2 rounded-xl text-white" required />
          <textarea placeholder="Descrição Detalhada do Ocorrido" value={descricao} onChange={e => setDescricao(e.target.value)} className="bg-gray-700 border border-gray-600 p-2 rounded-xl text-white h-24" required></textarea>
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl font-bold">Registrar Infração</button>
        </form>
      </div>

      <div className="max-w-4xl w-full mx-auto bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-lg font-bold mb-4">Logs de Auditoria Ativos (MongoDB)</h2>
        <div className="flex flex-col gap-3">
          {denuncias.map(d => (
            <div key={d._id} className="bg-gray-700 p-4 rounded-xl border-l-4 border-red-500 text-sm">
              <p><strong>Motivo:</strong> {d.motivo}</p>
              <p className="text-gray-300 mt-1"><strong>Descrição:</strong> {d.descricaoDetalhada}</p>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Status: <b className="text-yellow-400">{d.status}</b></span>
                <span>Data: {new Date(d.dataCriacao).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DenunciasProvisorio;