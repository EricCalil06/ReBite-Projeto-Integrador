const express = require('express');
const multer = require('multer');
const path = require('path');
const { Produto } = require('./banco'); // Importar o modelo Produto

const app = express();
const PORT = 3000;

// Middleware para parsing JSON
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

// Configuração do Multer para armazenamento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Pasta de destino
  },
  filename: (req, file, cb) => {
    // Renomear arquivo para algo único: timestamp + nome original
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// Rota para upload de imagem de produto
app.post('/produtos/upload', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    // Aqui você pode salvar os dados do produto no banco
    // Por exemplo, receber outros campos via req.body
    const { nome, descricao, preco, categoria } = req.body;

    if (!nome || !preco || !categoria) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
    }

    const produto = new Produto({
      nome,
      descricao,
      preco: parseFloat(preco),
      categoria,
      imagem: req.file.filename // Salvar apenas o nome do arquivo
    });

    await produto.save();

    res.status(201).json({
      message: 'Produto criado com sucesso',
      produto: {
        id: produto._id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        categoria: produto.categoria,
        imagem: req.file.filename,
        imagemUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    const produtosComUrl = produtos.map(produto => ({
      ...produto.toObject(),
      imagemUrl: produto.imagem ? `http://localhost:${PORT}/uploads/${produto.imagem}` : null
    }));
    res.json(produtosComUrl);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Tratamento de erros do Multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
    }
  }
  if (error.message === 'Apenas arquivos de imagem são permitidos!') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});