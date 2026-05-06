// subtopico.js
import mongoose from 'mongoose';
import Informacao from './informacao.js';

const InformacaoSchema = Informacao.schema;

const SubtopicoSchema = new mongoose.Schema({
  indice: { 
    type: Number, 
    required: true
  },
  titulo: { 
    type: String, 
    required: true 
  },
  // capaUrl: { 
  //   type: String 
  // },
  topicoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Topico', 
    required: true 
  },
  informacoes: [InformacaoSchema] // Array de informações
}, { timestamps: true });

export default mongoose.model('Subtopico', SubtopicoSchema);


