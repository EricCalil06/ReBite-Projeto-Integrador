import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String, 
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true,
        default: "cliente"
    },
    estabelecimentoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estabelecimento',
    default: null
}
}, { timestamps: true });

export default mongoose.model('Usuario', UsuarioSchema);