import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String, 
        required: true
    },
    cargo: {
        type: String,
        required: true
    }
});

export default mongoose.model('Usuario', UsuarioSchema);