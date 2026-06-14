import mongoose from 'mongoose';

const conviteSchema = new mongoose.Schema({
    emailColaborador: { type: String, required: true },
    estabelecimentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estabelecimento', required: true },
    nomeLoja: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'aceito', 'recusado'], default: 'pendente' }
}, { timestamps: true });

export default mongoose.model('Convite', conviteSchema);