const mongoose = require('mongoose');

// Conexão com o MongoDB
// Substitua pela sua string de conexão do MongoDB Atlas ou local
const mongoURI = 'mongodb://localhost:27017/banco_nodejs'; // Para MongoDB local
// Para MongoDB Atlas: 'mongodb+srv://username:password@cluster.mongodb.net/banco_nodejs'

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

// Schema para Conta
const contaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  numeroConta: { type: String, required: true, unique: true },
  saldo: { type: Number, default: 0 },
  tipo: { type: String, enum: ['corrente', 'poupanca'], default: 'corrente' },
  dataCriacao: { type: Date, default: Date.now }
});

// Schema para Transação
const transacaoSchema = new mongoose.Schema({
  contaOrigemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta', required: true },
  contaDestinoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conta' }, // Opcional para depósitos
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['deposito', 'saque', 'transferencia'], required: true },
  descricao: { type: String },
  data: { type: Date, default: Date.now }
});

// Schema para Produto
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  categoria: { type: String, enum: ['pao', 'iogurte', 'sacola_surpresa'], required: true },
  imagem: { type: String }, // Nome do arquivo da imagem
  dataCriacao: { type: Date, default: Date.now }
});

// Schema para Cliente
const clienteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
  hasEstablishment: { type: Boolean, default: false },
  COSaved: { type: Number, default: 0 }, // Estatística para gamificação
  dataCriacao: { type: Date, default: Date.now }
});

// Modelos
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Conta = mongoose.model('Conta', contaSchema);
const Transacao = mongoose.model('Transacao', transacaoSchema);
const Produto = mongoose.model('Produto', produtoSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);

// Exportar os modelos para uso em outros arquivos
module.exports = {
  Usuario,
  Conta,
  Transacao,
  Produto,
  Cliente
};

// Exemplo de uso básico (descomente para testar)
// async function exemplo() {
//   try {
//     // Criar um usuário
//     const usuario = new Usuario({
//       nome: 'João Silva',
//       email: 'joao@example.com',
//       senha: 'senha123'
//     });
//     await usuario.save();
//     console.log('Usuário criado:', usuario);

//     // Criar uma conta
//     const conta = new Conta({
//       usuarioId: usuario._id,
//       numeroConta: '12345-6',
//       saldo: 1000
//     });
//     await conta.save();
//     console.log('Conta criada:', conta);

//   } catch (error) {
//     console.error('Erro:', error);
//   }
// }

// exemplo();