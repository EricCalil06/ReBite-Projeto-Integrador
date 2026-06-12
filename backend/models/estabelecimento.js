import mongoose from 'mongoose';

const EstabelecimentoSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    donoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    endereco: { 
        type: String, 
        default: "" 
    },
    imagem: { 
        type: String, 
        default: "/imagem-padrao-loja.jpg" 
    },
    descricao: { 
        type: String, 
        default: "" 
    },
}, { 
    timestamps: true 
});

const Estabelecimento = mongoose.models.Estabelecimento || mongoose.model('Estabelecimento', EstabelecimentoSchema);

export default mongoose.model('Estabelecimento', EstabelecimentoSchema);