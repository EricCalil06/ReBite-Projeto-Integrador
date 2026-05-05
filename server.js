const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { 
  Produto,
  criarUsuario,
  autenticarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  atualizarSenha
} = require('./banco'); // Importar modelos e funções

const app = express();
const PORT = 3000;
const JWT_SECRET = 'sua_chave_secreta_aqui'; // Mude para uma chave segura em produção

// Middleware para parsing JSON
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// ===== ROTAS DE AUTENTICAÇÃO =====

// POST /auth/registro - Criar uma nova conta
app.post('/auth/registro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Criar usuário
    const usuario = await criarUsuario(nome, email, senha);

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /auth/login - Fazer login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Autenticar usuário
    const usuario = await autenticarUsuario(email, senha);

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// GET /auth/perfil/:id - Buscar dados do usuário
app.get('/auth/perfil/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário está acessando seus próprios dados
    if (req.usuarioId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const usuario = await buscarUsuarioPorId(id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// PUT /auth/perfil/:id - Atualizar dados do usuário
app.put('/auth/perfil/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    // Verificar se o usuário está atualizando seus próprios dados
    if (req.usuarioId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Validações básicas
    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const usuarioAtualizado = await atualizarUsuario(id, { nome, email });

    res.json({
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /auth/senha/:id - Atualizar senha do usuário
app.put('/auth/senha/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAnterior, novaSenha } = req.body;

    // Verificar se o usuário está alterando sua própria senha
    if (req.usuarioId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Validações básicas
    if (!senhaAnterior || !novaSenha) {
      return res.status(400).json({ error: 'Senha anterior e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter no mínimo 6 caracteres' });
    }

    const resultado = await atualizarSenha(id, senhaAnterior, novaSenha);

    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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