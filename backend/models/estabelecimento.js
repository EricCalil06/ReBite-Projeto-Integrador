import mongoose from 'mongoose';

const EstabelecimentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    donoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true } // Atrelado ao Administrador
});

export default mongoose.model('Estabelecimento', EstabelecimentoSchema);