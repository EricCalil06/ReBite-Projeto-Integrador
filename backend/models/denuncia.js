import mongoose from 'mongoose';

const DenunciaSchema = new mongoose.Schema({
    estabelecimentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estabelecimento', required: true },
    usuarioDenuncianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    motivo: { type: String, required: true },
    descricaoDetalhada: { type: String },
    status: { type: String, enum: ['pendente', 'analise', 'resolvido'], default: 'pendente' },
    dataCriacao: { type: Date, default: Date.now }
});

export default mongoose.model('Denuncia', DenunciaSchema);