import mongoose from 'mongoose';

const TopicosSchema = new mongoose.Schema({
  topico: { 
    type: String, 
    required: true 
  },
  
  resumo: {
    type: String, 
    required: true
  },

  //agora são apenas referências (ObjectIds)
  subtopicos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtopico'
    }
  ]
});

export default mongoose.model('Topico', TopicosSchema);
