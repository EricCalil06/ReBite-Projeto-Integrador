// 1. Importação das bibliotecas (ES Modules)
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Subtopico from './models/subtopicos.js';
import ImagemModel from './models/imagemModel.js';
import Informacao from './models/informacao.js';
import Topico from './models/topicos.js';
import Usuario from './models/usuario.js';
import Estatisticas from './models/estatisticas.js';
import ImagemThumbnail from './imagemThumbnail.js';
import Imagem from './imagem.js';
import hyperlink from './models/hyperlink.js';
import Estabelecimento from './models/estabelecimento.js';
import Funcionario from './models/funcionario.js';
import Produto from './models/produto.js';
import Denuncia from './models/denuncia.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const PORT = process.env.PORT || 5500;
const app = express();
app.use(express.json());
app.use(cors());
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

// seed hyperlinks
async function seedHyperlinks() {
  try {
    const hyperlinksData = [
      { nome: 'facebook', link: 'https://www.facebook.com/seu-pagina' },
      { nome: 'instagram', link: 'https://www.instagram.com/seu-usuario' },
      { nome: 'youtube', link: 'https://www.youtube.com/seu-canal' },
      { nome: 'linkedin', link: 'https://www.linkedin.com/company/sua-empresa' },
      { nome: 'kahoot', link: 'https://kahoot.com/pt-BR' },
    ];

    for (const hl of hyperlinksData) {
      const existe = await hyperlink.findOne({ nome: hl.nome });
      if (!existe) {
        const novo = new hyperlink(hl);
        await novo.save();
        console.log(`Hyperlink seed: Criado ${hl.nome}`);
      } else {
        console.log(`Hyperlink seed: Já existe ${hl.nome}`);
      }
    }
    console.log('Seed de hyperlinks concluído');
  } catch (error) {
    console.error('Erro ao fazer seed de hyperlinks:', error.message);
  }
}

app.get('/produtos', async (req, res) => {
    try {
        const estId = req.headers['x-estabelecimento-id']; 
        
        let filtro = {};
        if (estId) {
            filtro = { estabelecimentoId: estId };
        }

        const produtos = await mongoose.model('Produto').find(filtro);
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRUD VISITANTES -----------------------------------------------------------------------------------------------

// ROTA GET - Buscar estatísticas
app.get('/estatisticas', async (req, res) => {
  try {
    console.log('BACKEND: Buscando estatísticas...');

    const estatisticas = await Estatisticas.find({})
      .sort({ data: -1 })
      .limit(30);

    const totalAcessos = estatisticas.reduce((total, estat) => total + estat.totalAcessos, 0);

    const todosUsuariosUnicos = new Set();
    estatisticas.forEach(estat => {
      estat.usuariosUnicos.forEach(userId => todosUsuariosUnicos.add(userId));
    });

    const acessosPorDia = {};
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - (6 - i));
      const dataStr = data.toISOString().split('T')[0];

      const estatDia = estatisticas.find(e => e.data === dataStr);
      acessosPorDia[dataStr] = estatDia ? estatDia.totalAcessos : 0;
    }

    console.log('BACKEND: Estatísticas enviadas - Total:', totalAcessos);

    res.json({
      success: true,
      totalAcessos: totalAcessos,
      totalUsuariosUnicos: todosUsuariosUnicos.size,
      acessosPorDia: acessosPorDia,
      ultimaAtualizacao: new Date(),
      totalDiasRegistrados: estatisticas.length
    });
  } catch (error) {
    console.error('BACKEND: Erro ao buscar estatísticas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Registrar visita ao site (página inicial/geral)

app.post('/estatisticas/visita', async (req, res) => {
  try {
    console.log('BACKEND: ROTA POST /estatisticas/visita CHAMADA!');

    const dataAcesso = new Date(req.body.dataAcesso || Date.now());
    const dataFormatada = dataAcesso.toISOString().split('T')[0];
    const hora = dataAcesso.getHours();
    const pagina = req.body.pagina || 'site_geral';
    const userId = req.body.userId;

    console.log('BACKEND: Processando - Data:', dataFormatada, 'Hora:', hora, 'Página:', pagina, 'User:', userId);

    let estatistica = await Estatisticas.findOne({ data: dataFormatada });

    if (estatistica) {
      console.log('BACKEND: Estatística existente. Acessos antes:', estatistica.totalAcessos);
      estatistica.totalAcessos += 1;
      estatistica.acessosPorHora[hora] = (estatistica.acessosPorHora[hora] || 0) + 1;
      estatistica.paginasAcessadas[pagina] = (estatistica.paginasAcessadas[pagina] || 0) + 1;
      estatistica.markModified('acessosPorHora');
      estatistica.markModified('paginasAcessadas');

      if (userId && !estatistica.usuariosUnicos.includes(userId)) {
        estatistica.usuariosUnicos.push(userId);
        estatistica.markModified('usuariosUnicos');
      }

      estatistica.ultimaAtualizacao = new Date();
    } else {
      console.log('BACKEND: Criando NOVA estatística');
      estatistica = new Estatisticas({
        data: dataFormatada,
        totalAcessos: 1,
        acessosPorHora: { [hora]: 1 },
        paginasAcessadas: { [pagina]: 1 },
        usuariosUnicos: userId ? [userId] : [],
        ultimaAtualizacao: new Date()
      });
    }

    await estatistica.save();
    console.log('BACKEND: Visita registrada. Acessos agora:', estatistica.totalAcessos);

    res.json({
      success: true,
      message: 'Visita registrada com sucesso!',
      estatisticaId: estatistica._id,
      totalAcessos: estatistica.totalAcessos
    });

  } catch (error) {
    console.error('BACKEND: Erro ao registrar visita:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check (opcional, mas útil)
app.get('/health', (req, res) => {
  console.log('Health check chamado');
  res.json({ success: true, message: 'Backend OK' });
});

// FIM CRUD VISITANTES -----------------------------------------------------------------------------------------------

// CRUD CAPITULOS ----------------------------------------------------------------------------------------------------
app.post('/subtopicos', async (req, res) => {
  try {
    const novoSubtopico = new Subtopico(req.body);
    const salvo = await novoSubtopico.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar todos os Subtópicos
app.get('/subtopicos', async (req, res) => {
  try {
    const subtopicos = await Subtopico.find();
    res.json(subtopicos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar subtopicos de um topico
app.get('/topicos/:topicoId/subtopicos', async (req, res) => {
  try {
    const subtopicos = await Subtopico.find({ topicoId: req.params.topicoId });
    res.status(200).json(subtopicos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar subtópicos', error: err.message });
  }
});

// Buscar Subtópico por ID
app.get('/subtopicos/:id', async (req, res) => {
  try {
    const subtopico = await Subtopico.findById(req.params.id);
    if (!subtopico) return res.status(404).json({ message: 'Subtópico não encontrado' });
    res.json(subtopico);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar Subtópico
app.put('/subtopicos/:id', async (req, res) => {
  try {
    const atualizado = await Subtopico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!atualizado) return res.status(404).json({ message: 'Subtópico não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar Subtópico
app.delete('/subtopicos/:id', async (req, res) => {
  try {
    const subt = await Subtopico.findById(req.params.id);
    if (!subt) return res.status(404).json({ message: 'Subtópico não encontrado' });

    // remove referência do tópico pai
    await Topico.findByIdAndUpdate(subt.topicoId, {
      $pull: { subtopicos: subt._id }
    });

    await Subtopico.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subtópico deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// FIM CRUD CAPITULOS ----------------------------------------------------------------------------------------------------

// CRUD TÓPICOS --------------------------------------------------------------------------

app.post('/topicos', async (req, res) => {
  try {
    const novoTopico = new Topico(req.body)
    const salvo = await novoTopico.save()
    res.status(201).json(salvo)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.get('/topicos', async (req, res) => {
  try {
    const topicos = await Topico.find()
    res.json(topicos)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/topicos/:id', async (req, res) => {
  try {
    const topico = await Topico.findById(req.params.id)
    if (!topico) return res.status(404).json({ message: 'Tópico não encontrado' })
    res.json(topico)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.put('/topicos/:id', async (req, res) => {
  try {
    const atualizado = await Topico.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!atualizado) return res.status(404).json({ message: 'Tópico não encontrado' })
    res.json(atualizado)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.delete('/topicos/:id', async (req, res) => {
  try {
    const deletado = await Topico.findByIdAndDelete(req.params.id)
    if (!deletado) return res.status(404).json({ message: 'Tópico não encontrado' })
    res.json({ message: 'Tópico deletado com sucesso' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// FIM CRUD TÓPICOS ----------------------------------------------------------------------

// CRUD DE INFORMAÇÕES! ------------------------------------------------------------------

app.post('/informacao', async (req, res) => {
  try {
    const informacao = new Informacao(req.body)
    await informacao.save()
    res.status(201).json(informacao)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.get('/informacao', async (req, res) => {
  try {
    const informacoes = await Informacao.find()
    res.json(informacoes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/informacao/:id', async (req, res) => {
  try {
    const info = await Informacao.findById(req.params.id)
    if (!info) return res.status(404).json({ message: 'Não encontrado' })
    res.json(info)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.put('/informacao/:id', async (req, res) => {
  try {
    const info = await Informacao.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(info)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.delete('/informacao/:id', async (req, res) => {
  try {
    await Informacao.findByIdAndDelete(req.params.id)
    res.json({ message: 'Informação removida' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// FIM CRUD DE INFORMAÇÕES! --------------------------------------------------------------

// CRUD DE IMAGENS! ----------------------------------------------------------------------

// Código para salvar a imagem nos arquivos
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/temp/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

// Códigos para o banco de dados
app.post('/images', upload.single('imagem'), async (req, res) => {
  try {

    const imagem = new Imagem();
    const thumbnail = new ImagemThumbnail();

    const { filename, path: zipPath } = req.file;
    const { nomeImagem, topico, subtopico, anotacao } = req.body;

    const pastaBase = await imagem.descompactarZip(zipPath, nomeImagem);

    console.log(pastaBase)

    const resultado = await imagem.prepararPastaMrxs(pastaBase, nomeImagem);

    console.log(resultado.enderecoPastaMrxs);
    let enderecoThumbnail = null;

    console.log(`mrxsFile: ${resultado.mrxsFile}`);
    console.log(`mrxsPath: ${resultado.mrxsPath}`);

    try {
      const thumbnailName = `${path.parse(resultado.mrxsFile).name}.jpg`;
      enderecoThumbnail = await thumbnail.criarAPartirDeMRXS(resultado.mrxsPath, thumbnailName);
    } catch (erro) {
      console.log('Falha ao gerar thumbnail: ', erro.message);
    }

    const tilesDir = await imagem.preGerarTilesPrincipais(resultado.mrxsFile, resultado.mrxsPath);

    const novaImagem = new ImagemModel({
      nomeArquivo: resultado.nomeArquivoMrxs,
      nomeImagem: nomeImagem,
      enderecoPastaMrxs: resultado.mrxsDir,
      enderecoThumbnail: enderecoThumbnail,
      enderecoTiles: tilesDir,
      topico: topico,
      subtopico: subtopico,
      anotacao: anotacao
    });

    await novaImagem.save();

    res.status(200).json({ message: 'Imagem salva com sucesso!' });

  } catch (error) {
    console.error("Erro completo ao salvar imagem:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/images', async (req, res) => {
  try {
    dadosImagens = await ImagemModel.find();
    res.status(200).json(dadosImagens);
  } catch (erro) {
    res.status(500).json({ message: erro.message });
  }
});

app.put('/images/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const info = await ImagemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(info);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/images/:id', async (req, res) => {
  try {
    const imagem = await ImagemModel.findById(req.params.id);
    if (!imagem) {
      return res.json({ error: 'Imagem não encontrada' });
    }
    else {
      if (fs.existsSync(imagem.enderecoPastaMrxs)) {
        fs.rmSync(imagem.enderecoPastaMrxs, { recursive: true, force: true });
      }

      if (imagem.enderecoThumbnail && fs.existsSync(imagem.enderecoThumbnail)) {
        fs.unlinkSync(imagem.enderecoThumbnail);
      }

      if (imagem.enderecoTiles && fs.existsSync(imagem.enderecoTiles)) {
        fs.rmSync(imagem.enderecoTiles, { recursive: true, force: true });
      }

      await ImagemModel.findByIdAndDelete(imagem.id);

      res.status(200).json({ message: 'Imagem apagada com sucesso!' });
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FIM CRUD DE IMAGENS! ------------------------------------------------------------------

// CÓDIGO PARA EXIBIR OS TILES -----------------------------------------------------------

// Código para pegar os metadados da imagem
app.get('/:imageId/meta.json', async (req, res) => {
    try {
        const { imageId } = req.params;
        const tilesDir = path.join('uploads', 'tiles', imageId);
        const metaPath = path.join(tilesDir, 'meta.json');
        
        console.log(`Buscando metadados: ${metaPath}`);
        
        if (await fs.pathExists(metaPath)) {
            const meta = await fs.readJson(metaPath);
            console.log('Metadados encontrados:', Object.keys(meta.level_metas || {}).length, 'níveis');
            res.json(meta);
        } else {
            console.log('Metadados não encontrados');
            res.status(404).json({ error: 'Metadados não encontrados' });
        }
    } catch (error) {
        console.error('Erro ao carregar metadados:', error);
        res.status(500).json({ error: error.message });
    }
});

// Código para os tiles
app.get('/tiles/:imageId/:level/:x/:y', async (req, res) => {
    try {
        const { imageId, level, x, y } = req.params;

        const imagem = new Imagem();
        
        const imagemMrxs = await ImagemModel.findById(imageId);
        if (!imagemMrxs) {
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }

        const tilesDir = imagemMrxs.enderecoTiles;
        const cleanY = y.replace('.jpg', '');
        const tilePath = path.join(tilesDir, `level_${level}`, `${x}_${cleanY}.jpg`);
                
        console.log(`Buscando tile: ${tilePath}`);
        
        if (fs.existsSync(tilePath)) {
            console.log('Tile pré-gerado encontrado');
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(path.resolve(tilePath));
        }

        const mrxsPath = path.join(imagemMrxs.enderecoPastaMrxs, imagemMrxs.nomeArquivo);
        if (!fs.existsSync(mrxsPath)) {
          return res.status(404).json({ error: 'Imagem MRXS não encontrada' });
        }
        
        console.log(`Chamando Python: level=${level}, x=${x}, y=${cleanY}`);
        
        const generatedPath = await imagem.gerarTile(mrxsPath, tilesDir, level, x, cleanY);
        
        console.log(`Tile gerado: ${generatedPath}`);
        
        if (fs.existsSync(generatedPath)) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.sendFile(path.resolve(generatedPath));
        } else {
            console.log('Arquivo gerado não encontrado:', generatedPath);
            res.status(500).json({ error: 'Falha ao gerar tile - arquivo não criado' });
        }
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Código para ver se uma imagem tem tiles
app.get('/tiles/:imageId/status', async (req, res) => {
    try {
        const { imageId } = req.params;
        const tilesDir = path.join('uploads', 'tiles', imageId);
        const metaPath = path.join(tilesDir, 'meta.json');
        
        const exists = await fs.existsSync(metaPath);
        res.json({ 
            hasTiles: exists,
            imageId: imageId
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// FIM DO CÓDIGO PARA EXIBIR OS TILES ----------------------------------------------------

// CRUD DE USUÁRIOS! ---------------------------------------------------------------------
app.post('/cadastro', async (req, res) => {
  try {
    const { email, senha, cargo } = req.body;
    const usuario = new Usuario({ 
      email: email, 
      senha: senha, 
      cargo: cargo 
    });

    const respMongo = await usuario.save();
    console.log("Usuário criado:", respMongo);
    res.status(201).json(respMongo); 
  } catch (erro) {
    res.status(409).json({ error: erro.message });
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

  res.status(200).json({ token: token, cargo: usuarioExiste.cargo, id: usuarioExiste._id });
});

async function obterEstabelecimento(req, res, next) {
    const donoId = req.headers['x-usuario-id'];
    if (!donoId) return res.status(401).json({ error: "Usuário não identificado." });
    
    let est = await Estabelecimento.findOne({ donoId });
    if (!est) {
        // Cria um provisório se o Admin não tiver para não quebrar o fluxo
        est = new Estabelecimento({ nome: "Meu Estabelecimento Provisório", donoId });
        await est.save();
    }
    req.estabelecimentoId = est._id;
    next();
}

// --- CRUD FUNCIONÁRIOS ---
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

// --- CRUD PRODUTOS (Avulsos e Sacolas Surpresa) ---
app.post('/produtos', obterEstabelecimento, async (req, res) => {
    try {
        const novo = new Produto({ ...req.body, estabelecimentoId: req.estabelecimentoId });
        await novo.save();
        res.status(201).json(novo);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/produtos', obterEstabelecimento, async (req, res) => {
    const lista = await Produto.find({ estabelecimentoId: req.estabelecimentoId });
    res.json(lista);
});

app.put('/produtos/:id', async (req, res) => {
    const atualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
});

app.delete('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: "Deletado com sucesso" });
});

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

app.post('/estabelecimento', async (req, res) => {
    try {
        const donoId = req.headers['x-usuario-id'];
        const { nome } = req.body;

        if (!donoId) {
            return res.status(401).json({ error: "Usuário não identificado nos cabeçalhos." });
        }

        const Estabelecimento = obterModelEstabelecimento();

        const perfilLoja = await Estabelecimento.findOneAndUpdate(
            { donoId },
            { nome },
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
        const donoId = req.headers['x-usuario-id'];

        if (!donoId) {
            return res.status(401).json({ error: "Usuário não identificado." });
        }

        const Estabelecimento = obterModelEstabelecimento();
        const loja = await Estabelecimento.findOne({ donoId });

        if (!loja) {
            return res.status(200).json({ nome: "Minha Loja" });
        }

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
app.get('/debug', (req, res) => {
    res.json({ mensagem: "Servidor vivo na porta 5500!" });
});

if (process.env.NODE_ENV !== 'test') {
  conectarAoMongo()
    .then(async () => {
      console.log('Conectado ao MongoDB');
      await seedHyperlinks();
    })
    .catch(err => console.log("Erro conexão Mongo:", err))

  const PORT = 3000
  app.listen(PORT, () => console.log(`server up & running, conexão ok`))
}

