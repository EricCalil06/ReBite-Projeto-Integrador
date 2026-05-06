import mongoose from 'mongoose';

const InformacaoSchema = new mongoose.Schema({
  indice: { 
    type: Number, 
    required: true 
  },
  informacao: {  // Campo deve se chamar "informacao"
    type: String, 
    required: true 
  }
}, { _id: true }); // permitir que MongoDB gere _id automático

export default mongoose.model('Informacao', InformacaoSchema);