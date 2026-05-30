import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true },
    vendedorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', // Relaciona o produto diretamente com o seu Schema de Usuário
        required: true 
    }
});

export default mongoose.model('Produto', ProdutoSchema);