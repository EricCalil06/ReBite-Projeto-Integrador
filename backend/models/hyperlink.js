import mongoose from 'mongoose';

const HyperlinkSchema = new mongoose.Schema({
  link: { 
    type: String, 
    required: true
  },
    nome: { 
    type: String, 
    required: true
  }
}, {timestamps: true, _id: true });

export default mongoose.model('hyperlink', HyperlinkSchema);