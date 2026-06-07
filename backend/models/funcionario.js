import mongoose from 'mongoose';

const FuncionarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    funcao: { type: String, enum: ['ADM', 'Repositor', 'Colaborador'], required: true },
    estabelecimentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estabelecimento', required: true }
});

export default mongoose.model('Funcionario', FuncionarioSchema);