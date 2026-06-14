import dotenv from 'dotenv'; 
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Usuario from './models/usuario.js';
import Estabelecimento from './models/estabelecimento.js';
import Funcionario from './models/funcionario.js';
import Produto from './models/produto.js';
import Denuncia from './models/denuncia.js';
import Pedido from './models/Pedido.js';
import Convite from './models/Convite.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5500;
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('public'));
dotenv.config();

app.listen(PORT, () => {
  console.log(`servidor em: ${PORT}`);
});

async function conectarAoMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao Mongo:", error);
  }
}

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("Conectado ao MongoDB com .env"))
  .catch((err) => console.error("Erro ao conectar:", err));

function obterModelEstabelecimento() {
    if (mongoose.models.Estabelecimento) {
        return mongoose.models.Estabelecimento;
    }
    const schema = new mongoose.Schema({
        donoId: { type: String, required: true },
        nome: { type: String, required: true }
    }, { collection: 'estabelecimentos' });
    
    return mongoose.model('Estabelecimento', schema);
}

async function obterEstabelecimento(req, res, next) {
    const donoId = req.headers['x-usuario-id'];
    console.log("middleware - donoId recebido:", donoId);
    if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });
    
    let est = await Estabelecimento.findOne({ donoId });
    console.log("middleware - estabelecimento encontrado:", est?._id);
    if (!est) {
        // Cria um provisório se o Admin não tiver para não quebrar o fluxo
        est = new Estabelecimento({ nome: "Meu Estabelecimento Provisório", donoId });
        await est.save();
    }
    req.estabelecimentoId = est._id;
    next();
}

// CRUD DE USUÁRIOS! ---------------------------------------------------------------------
app.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha, telefone, dataNascimento } = req.body;

    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }

    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      telefone,
      cargo: "cliente"
    });
    await novoUsuario.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error);
    res.status(500).json({ error: "Erro interno do servidor ao realizar cadastro." });
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuarioExiste = await Usuario.findOne({ email: email });

  if (!usuarioExiste) {
    return res.status(401).json({ mensagem: "Email inválido!" });
  }

  const senhaValida = (senha === usuarioExiste.senha); 

  if (!senhaValida) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }

  const token = jwt.sign(
    { email: email },
    "id-secreto",
    { expiresIn: "7d" }
  );

res.status(200).json({
    token: token,
    cargo: usuarioExiste.cargo,
    id: usuarioExiste._id,
    nome: usuarioExiste.nome,
    estabelecimentoId: usuarioExiste.estabelecimentoId || null
  });
});

app.get('/me', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Sem token" });

    try {
        const decoded = jwt.verify(token, "id-secreto");
        const usuario = await Usuario.findOne({ email: decoded.email });
        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
        
        // Retorna dados públicos do usuário
        res.status(200).json({ nome: usuario.nome, id: usuario._id });
    } catch (e) {
        res.status(401).json({ error: "Token inválido" });
    }
});

// ------------------- CRUD FUNCIONÁRIOS ----------------------------------------------------------------
app.post('/funcionarios', obterEstabelecimento, async (req, res) => {
    try {
        const novo = new Funcionario({ ...req.body, estabelecimentoId: req.estabelecimentoId });
        await novo.save();
        res.status(201).json(novo);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/funcionarios', obterEstabelecimento, async (req, res) => {
    const lista = await Funcionario.find({ estabelecimentoId: req.estabelecimentoId });
    res.json(lista);
});

app.delete('/funcionarios/:id', async (req, res) => {
    await Funcionario.findByIdAndDelete(req.params.id);
    res.json({ message: "Funcionário removido" });
});

// Cadastrar funcionário
app.post('/funcionarios/cadastrar', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });

        const dono = await Usuario.findById(donoId);
        if (!dono || dono.cargo !== 'admin') {
            return res.status(403).json({ error: "Apenas administradores podem convidar funcionários." });
        }

        // Busca a loja do admin
        const loja = await Estabelecimento.findOne({ donoId });
        if (!loja) {
            return res.status(404).json({ error: "Você precisa ter uma loja cadastrada antes de adicionar funcionários." });
        }

        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email do funcionário é obrigatório." });

        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(404).json({ error: "Usuário com este email não encontrado no aplicativo." });

        if (usuario.cargo === 'admin') {
            return res.status(400).json({ error: "Não é possível convidar um administrador." });
        }

        if (usuario.cargo === 'funcionario' && String(usuario.estabelecimentoId) === String(loja._id)) {
            return res.status(400).json({ error: "Este usuário já é funcionário da sua loja." });
        }

        // Verifica se já existe um convite pendente para essa pessoa nessa loja
        const conviteExistente = await Convite.findOne({ 
            emailColaborador: email, 
            estabelecimentoId: loja._id, 
            status: 'pendente' 
        });

        if (conviteExistente) {
            return res.status(400).json({ error: "Já existe um convite pendente para este e-mail." });
        }

        const novoConvite = new Convite({
            emailColaborador: email,
            estabelecimentoId: loja._id,
            nomeLoja: loja.nome
        });
        await novoConvite.save();

        res.status(200).json({ message: `Convite enviado com sucesso para ${usuario.nome}!` });
    } catch (error) {
        console.error("Erro ao enviar convite:", error);
        res.status(500).json({ error: error.message });
    }
});

// ADICIONAR esta nova rota (pode substituir o GET /funcionarios existente ou coexistir)
app.get('/funcionarios/da-loja', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });

        const loja = await Estabelecimento.findOne({ donoId });
        if (!loja) return res.status(404).json({ error: "Loja não encontrada." });

        const funcionarios = await Usuario.find(
            { cargo: 'funcionario', estabelecimentoId: loja._id },
            'nome email telefone estabelecimentoId createdAt' // só retorna campos necessários, omite senha
        );

        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/funcionarios/da-loja/:id', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });

        const dono = await Usuario.findById(donoId);
        if (!dono || dono.cargo !== 'admin') {
            return res.status(403).json({ error: "Apenas administradores podem remover funcionários." });
        }

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: "Funcionário não encontrado." });

        usuario.cargo = 'cliente';
        usuario.estabelecimentoId = null;
        await usuario.save();

        res.status(200).json({ message: `${usuario.nome} foi removido da equipe.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- CRUD PRODUTOS (Avulsos e Sacolas Surpresa) ---
app.get('/produtos', async (req, res) => {
    try {
        const estId = req.headers['x-estabelecimento-id'];
        const donoId = req.headers['x-usuario-id'];

        let estabelecimentoId;

        if (estId) {
            estabelecimentoId = estId;
        } else if (donoId) {
            const est = await Estabelecimento.findOne({ donoId });
            if (!est) return res.status(404).json({ error: "Loja não encontrada." });
            estabelecimentoId = est._id;
        } else {
            return res.status(401).json({ error: "Identificação não fornecida." });
        }

        const lista = await Produto.find({ estabelecimentoId });
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/produtos', obterEstabelecimento, async (req, res) => {
    try {
        const novo = new Produto({ ...req.body, estabelecimentoId: req.estabelecimentoId });
        await novo.save();
        res.status(201).json(novo);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/produtos/:id', async (req, res) => {
    const atualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
});

app.delete('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: "Deletado com sucesso" });
});

// READ: Listar apenas os produtos do vendedor logado
app.get('/produtos/vendedor/:vendedorId', async (req, res) => {
    try {
        const produtos = await Produto.find({ vendedorId: req.params.vendedorId });
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: Editar dados do produto
app.put('/produtos/:id', async (req, res) => {
    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Remover produto da sacola
app.delete('/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ------- PRODUTOS --------------

// --- ROTA DE DENÚNCIAS ---
app.post('/denuncias', async (req, res) => {
    try {
        const nova = new Denuncia(req.body);
        await nova.save();
        res.status(201).json(nova);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/denuncias', async (req, res) => {
    const lista = await Denuncia.find().populate('estabelecimentoId');
    res.json(lista);
});
//-------------------------------------------------------------------------------------------------------

app.post('/estabelecimento', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        const { nome, descricao, endereco } = req.body;

        if (!donoId) {
            return res.status(401).json({ error: "Usuário não identificado nos cabeçalhos." });
        }

        const Estabelecimento = obterModelEstabelecimento();

        const perfilLoja = await Estabelecimento.findOneAndUpdate(
            { donoId },
            { nome, descricao, endereco },
            { new: true, upsert: true }
        );

        res.status(200).json(perfilLoja);
    } catch (error) {
        console.error("Erro na rota POST /estabelecimento:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/estabelecimento/perfil', async (req, res) => {
    try {
        // Captura os dois cabeçalhos possíveis enviados pelo Frontend
        const estabelecimentoId = req.headers['x-estabelecimento-id'];
        const donoId = req.headers['x-usuario-id'];

        const Estabelecimento = obterModelEstabelecimento();
        let loja = null;

        // Se o frontend informou o ID direto da loja (caso da PaginaCliente), busca por ele
        if (estabelecimentoId) {
            loja = await Estabelecimento.findById(estabelecimentoId);
        } 
        // Se não informou o ID da loja, mas informou o ID do usuário (caso do Painel da Loja), busca pelo dono
        else if (donoId) {
            loja = await Estabelecimento.findOne({ donoId });
        } 
        // Se não enviou nenhum dos dois, barra por falta de identificação (Erro 401)
        else {
            return res.status(401).json({ error: "Estabelecimento ou Usuário não identificado." });
        }

        // Se a busca não encontrar nada no banco, retorna o objeto padrão provisório
        if (!loja) {
            return res.status(200).json({ nome: "Minha Loja" });
        }

        // Retorna a loja correta encontrada
        res.status(200).json(loja);
    } catch (error) {
        console.error("Erro na rota GET /estabelecimento/perfil:", error);
        res.status(500).json({ error: error.message });
    }
});
// Rota no backend para o frontend checar se o Admin já tem uma loja
app.get('/estabelecimento/checar', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });

        // Procura se já existe uma loja para este ID de administrador
        const estabelecimento = await Estabelecimento.findOne({ donoId });
        
        if (estabelecimento) {
            // Se achou, retorna que já existe
            return res.status(200).json({ existe: true, estabelecimento });
        } else {
            // Se não achou, diz que não existe
            return res.status(200).json({ existe: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/estabelecimento/todos', async (req, res) => {
  try {
    // Buscando os estabelecimentos no MongoDB
    const estabelecimentos = await Estabelecimento.find();
    
    // Retorna a lista de lojas para o aplicativo
    res.status(200).json(estabelecimentos);
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ROTA CORRIGIDA: Buscar estabelecimento e itens baseado nos campos reais do banco
app.get('/estabelecimento/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Busca o estabelecimento
    const estabelecimento = await Estabelecimento.findById(id);
    if (!estabelecimento) {
      return res.status(404).json({ message: "Estabelecimento não encontrado." });
    }

    // 2. Busca todos os itens (produtos/sacolas) vinculados a este estabelecimentoId
    // IMPORTANTE: Use o nome exato do seu Model de produtos aqui (ex: Produto ou Item)
    const itensDoBanco = await Produto.find({ estabelecimentoId: id });

    const categoriasMap = {};
    const sacolas = [];

    // 3. Separa dinamicamente olhando o seu campo 'tipo' e 'categoria' do banco
    itensDoBanco.forEach(item => {
      if (item.tipo === "sacola_surpresa") {
        // Se for sacola surpresa (conforme a imagem do seu banco)
        sacolas.push({
          id: item._id,
          nome: item.nome,
          categoria: item.categoria || "Sacola Surpresa",
          preco: item.preco,
          precoOriginal: item.precoOriginal || (item.preco * 1.3), // Fallback caso não tenha precoOriginal cadastrado
          unidade: "1un",
          imagem: item.imagem || null
        });
      } else {
        // Se for produto comum (Pães, Doces, Laticínios, etc.)
        const catNome = item.categoria || "Geral";

        if (!categoriasMap[catNome]) {
          categoriasMap[catNome] = {
            categoria: catNome,
            produtos: []
          };
        }

        categoriasMap[catNome].produtos.push({
          id: item._id,
          nome: item.nome,
          preco: item.preco,
          precoOriginal: item.precoOriginal || (item.preco * 1.2),
          unidade: item.unidade || "un",
          imagem: item.imagem || null
        });
      }
    });

    // Converte o mapa de categorias para o formato de Array que o index.jsx mapeia
    const categoriasProdutos = Object.values(categoriasMap);

    // 4. Retorna a resposta perfeita que o mobile espera
    res.status(200).json({
      ...estabelecimento._doc,
      categoriasProdutos,
      sacolas
    });

  } catch (error) {
    console.error("Erro na rota /estabelecimento/:id :", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});


//--------------- ESTABELECIMENTO -----------------------

app.post('/pedidos', async (req, res) => {
    try {
        const { estabelecimentoId, usuarioId, itens, total } = req.body;

        const novoPedido = await mongoose.model('Pedido').create({
            estabelecimentoId,
            usuarioId,
            itens,
            total
        });

        res.status(201).json(novoPedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/pedidos/estabelecimento', async (req, res) => {
    try {
        const estId = req.headers['x-estabelecimento-id'];

        if (!estId) {
            return res.status(400).json({ error: "ID do estabelecimento não fornecido." });
        }

        // Acessa o Types diretamente de dentro do mongoose importado no topo do arquivo
        const { Types } = mongoose;

        // Valida se o ID recebido tem o formato correto de 24 caracteres hexadecimais
        if (!Types.ObjectId.isValid(estId)) {
            return res.status(400).json({ error: "ID do estabelecimento em formato inválido." });
        }

        const Pedido = mongoose.model('Pedido');
        
        // Convertemos a String estId em um ObjectId real usando o Types nativo do mongoose
        const pedidos = await Pedido.find({ 
            estabelecimentoId: new Types.ObjectId(estId) 
        })
        .sort({ createdAt: -1 });

        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos do estabelecimento:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/pedidos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }
        const Pedido = mongoose.model('Pedido');
        const pedido = await Pedido.findById(id);
        if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/pedidos/usuario/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;

        console.log("Buscando pedidos para usuarioId:", usuarioId);

        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ error: "ID de usuário inválido." });
        }

        const pedidos = await mongoose.model('Pedido').find({ 
            usuarioId: new mongoose.Types.ObjectId(usuarioId) 
        })
        .sort({ createdAt: -1 });

        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/pedidos/usuario/:usuarioId/kgs', async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const Pedido = mongoose.model('Pedido');
        const pedidos = await Pedido.find({
            usuarioId: new mongoose.Types.ObjectId(usuarioId),
            status: { $in: ['Pronto', 'Entregue'] }
        }).populate('itens.produtoId', 'peso');

        let totalKg = 0;
        pedidos.forEach(pedido => {
            pedido.itens.forEach(item => {
                const peso = item.produtoId?.peso || 0;
                totalKg += peso * item.quantidade;
            });
        });

        res.status(200).json({ totalKg: totalKg.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/pedidos/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusValidos = ['Pendente', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ error: "Status inválido." });
        }

        const Pedido = mongoose.model('Pedido');
        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });

        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//----------------------------------------------PEDIDOS------------------------------------------------
// ROTA: Buscar um único produto/sacola por ID e trazer sugestões
app.get('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use o nome do seu Model cadastrado (ex: Produto)
    const produtoEncontrado = await Produto.findById(id);

    if (!produtoEncontrado) {
      return res.status(404).json({ message: "Item não encontrado no banco." });
    }

    // Busca até 5 outros produtos da mesma loja para listar no carrossel inferior como sugestão
    const outrosProdutos = await Produto.find({
      estabelecimentoId: produtoEncontrado.estabelecimentoId,
      _id: { $ne: id } // Não traz o próprio produto atual repetido na lista
    }).limit(5);

    res.status(200).json({
      produto: produtoEncontrado,
      outrosProdutos: outrosProdutos
    });

  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});
//------------------------------- PEDIDOS --------------------------------------------

app.post("/pedido/novo", async (req, res) => {
  try {
    // Certifique-se de que o express.json() está ativo no topo do seu app.js
    const { estabelecimentoId, usuarioId, itens, total } = req.body;

    console.log("Recebido no Backend:", req.body);

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ message: "O array de itens está vazio ou não foi recebido corretamente." });
    }

    if (!estabelecimentoId || !usuarioId) {
      return res.status(400).json({ message: "estabelecimentoId e usuarioId são obrigatórios." });
    }

    const novoPedido = new Pedido({
      estabelecimentoId,
      usuarioId,
      itens,
      total
    });

    const pedidoSalvo = await novoPedido.save();
    res.status(201).json({ message: "Pedido finalizado!", pedido: pedidoSalvo });

  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({ message: "Erro interno", detalhes: error.message });
  }
});

// --------------- PEDIDOS --------------------------------

app.get('/debug', (req, res) => {
    res.json({ mensagem: "Servidor vivo na porta 5500!" });
});

if (process.env.NODE_ENV !== 'test') {
  conectarAoMongo()
    .then(async () => {
      console.log('Conectado ao MongoDB');
      //await seedHyperlinks();
    })
    .catch(err => console.log("Erro conexão Mongo:", err))

  const PORT = 3000
  app.listen(PORT, () => console.log(`server up & running, conexão ok`))
}

app.get('/convites/meus-convites', async (req, res) => {
    try {
        const usuarioId = req.headers['x-usuario-id'];
        if (!usuarioId) return res.status(401).json({ error: "Usuário não identificado." });
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado." });

        const convites = await Convite.find({ emailColaborador: usuario.email, status: 'pendente' });
        res.status(200).json(convites);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/convites/:id/responder', async (req, res) => {
    try {
        const { id } = req.params;
        const { resposta } = req.body;
        const usuarioId = req.headers['x-usuario-id'];

        if (!['aceito', 'recusado'].includes(resposta)) return res.status(400).json({ error: "Resposta inválida." });

        const convite = await Convite.findById(id);
        if (!convite || convite.status !== 'pendente') return res.status(404).json({ error: "Convite não encontrado ou já respondido." });

        const usuario = await Usuario.findById(usuarioId);
        if (usuario.email !== convite.emailColaborador) return res.status(403).json({ error: "Acesso negado." });

        convite.status = resposta;
        await convite.save();

        if (resposta === 'aceito') {
            usuario.cargo = 'funcionario';
            usuario.estabelecimentoId = convite.estabelecimentoId;
            await usuario.save();
        }
        res.status(200).json({ message: `Convite ${resposta} com sucesso.` });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/convites/da-loja', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        const loja = await Estabelecimento.findOne({ donoId });
        if (!loja) return res.status(404).json({ error: "Loja não encontrada." });

        const convites = await Convite.find({ estabelecimentoId: loja._id, status: 'pendente' });
        res.status(200).json(convites);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/convites/enviar', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        const { emailColaborador } = req.body;

        if (!emailColaborador) return res.status(400).json({ error: "E-mail do colaborador é obrigatório." });

        const loja = await Estabelecimento.findOne({ donoId });
        if (!loja) return res.status(404).json({ error: "Loja não encontrada." });

        const usuario = await Usuario.findOne({ email: emailColaborador });
        if (!usuario) return res.status(404).json({ error: "Usuário com este e-mail não encontrado no aplicativo." });

        if (usuario.cargo === 'admin') {
            return res.status(400).json({ error: "Não é possível convidar um administrador." });
        }

        if (usuario.estabelecimentoId) {
            if (String(usuario.estabelecimentoId) === String(loja._id)) {
                return res.status(400).json({ error: "Este usuário já é funcionário da sua loja." });
            } else {
                return res.status(400).json({ error: "Este usuário já trabalha em outro estabelecimento." });
            }
        }

        const conviteExistente = await Convite.findOne({ emailColaborador, status: 'pendente' });
        if (conviteExistente) return res.status(400).json({ error: "Já existe um convite pendente para este e-mail." });

        const novoConvite = new Convite({ emailColaborador, estabelecimentoId: loja._id, nomeLoja: loja.nome });
        await novoConvite.save();

        res.status(201).json({ message: "Convite enviado com sucesso!" });
        
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    });

app.delete('/convites/:id', async (req, res) => {
    try {
        await Convite.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Convite cancelado." });
    } catch (error) { res.status(500).json({ error: error.message }); }
});