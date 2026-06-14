import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true },
    validade: { type: Date, required: true },
    alertasAlergicos: { type: String },
    peso: { type: Number, default: 0 },
    categoria: { type: String, required: true },
    tipo: { type: String, enum: ['avulso', 'sacola_surpresa'], default: 'avulso' },
    estabelecimentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estabelecimento', required: true },
});

export default mongoose.model('Produto', ProdutoSchema);