const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoURI = 'mongodb://localhost:27017/banco_nodejs';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema para Usuário
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  dataCriacao: { type: Date, default: Date.now }
});

usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

const contaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  numeroConta: { type: String, required: true, unique: true },
  saldo: { type: Number, default: 0 },
  tipo: { type: String, enum: ['corrente', 'poupanca'], default: 'corrente' },
  dataCriacao: { type: Date, default: Date.now }
});

const transacaoSchema = new mongoose.Schema({
  contaOrigemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
  contaDestinoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta' },
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['deposito', 'saque', 'transferencia'], required: true },
  descricao: { type: String },
  data: { type: Date, default: Date.now }
});

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  categoria: { type: String, enum: ['pao', 'iogurte', 'sacola_surpresa'], required: true },
  imagem: { type: String },
  dataCriacao: { type: Date, default: Date.now }
});

const clienteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
  hasEstablishment: { type: Boolean, default: false },
  COSaved: { type: Number, default: 0 },
  dataCriacao: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const Conta = mongoose.model('Conta', contaSchema);
const Transacao = mongoose.model('Transacao', transacaoSchema);
const Produto = mongoose.model('Produto', produtoSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);

async function criarUsuario(nome, email, senha) {
  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw new Error('Email já está registrado');
    }

    const novoUsuario = new Usuario({
      nome,
      email,
      senha
    });

    await novoUsuario.save();

    return {
      _id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      dataCriacao: novoUsuario.dataCriacao
    };
  } catch (error) {
    throw new Error(`Erro ao criar usuário: ${error.message}`);
  }
}

async function autenticarUsuario(email, senha) {
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    return {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      dataCriacao: usuario.dataCriacao
    };
  } catch (error) {
    throw new Error(`Erro ao autenticar: ${error.message}`);
  }
}

async function buscarUsuarioPorId(usuarioId) {
  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      dataCriacao: usuario.dataCriacao
    };
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
}

async function atualizarUsuario(usuarioId, dados) {
  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      { nome: dados.nome, email: dados.email },
      { new: true, runValidators: true }
    );

    if (!usuarioAtualizado) {
      throw new Error('Usuário não encontrado');
    }

    return {
      _id: usuarioAtualizado._id,
      nome: usuarioAtualizado.nome,
      email: usuarioAtualizado.email,
      dataCriacao: usuarioAtualizado.dataCriacao
    };
  } catch (error) {
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
}

// Função para atualizar senha
async function atualizarSenha(usuarioId, senhaAnterior, novaSenha) {
  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se a senha anterior está correta
    const senhaValida = await usuario.compararSenha(senhaAnterior);
    if (!senhaValida) {
      throw new Error('Senha anterior incorreta');
    }

    // Atualizar senha
    usuario.senha = novaSenha;
    await usuario.save();

    return { mensagem: 'Senha atualizada com sucesso' };
  } catch (error) {
    throw new Error(`Erro ao atualizar senha: ${error.message}`);
  }
}

// Exportar os modelos e funções de autenticação
module.exports = {
  Usuario,
  Conta,
  Transacao,
  Produto,
  Cliente,
  // Funções de autenticação
  criarUsuario,
  autenticarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  atualizarSenha
};
