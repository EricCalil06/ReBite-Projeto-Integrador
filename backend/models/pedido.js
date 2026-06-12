import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
    estabelecimentoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Estabelecimento', 
        required: true 
    },
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    itens: [{
        produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
        nome: String,
        quantidade: Number,
        preco: Number
    }],
    total: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pendente', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'], 
        default: 'Pendente' 
    }
}, { 
    timestamps: true
});

const Pedido = mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema);
export default Pedido;