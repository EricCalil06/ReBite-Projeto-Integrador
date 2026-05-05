# Documentação da API de Autenticação

## Rotas Disponíveis

### 1. POST /auth/registro
**Descrição:** Cria uma nova conta de usuário

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Response (201):**
```json
{
  "mensagem": "Usuário criado com sucesso",
  "usuario": {
    "_id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@example.com",
    "dataCriacao": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros:**
- 400: Email já registrado ou dados inválidos

---

### 2. POST /auth/login
**Descrição:** Faz login e retorna um token JWT

**Request:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@example.com",
    "dataCriacao": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros:**
- 401: Email ou senha incorretos

---

### 3. GET /auth/perfil/:id
**Descrição:** Busca os dados do usuário (requer autenticação)

**Headers:**
```
Authorization: Bearer {token_jwt}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "João Silva",
  "email": "joao@example.com",
  "dataCriacao": "2024-01-15T10:30:00.000Z"
}
```

**Erros:**
- 401: Token não fornecido ou inválido
- 403: Acesso negado (tentando acessar dados de outro usuário)
- 404: Usuário não encontrado

---

### 4. PUT /auth/perfil/:id
**Descrição:** Atualiza os dados do usuário (requer autenticação)

**Headers:**
```
Authorization: Bearer {token_jwt}
```

**Request:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.silva@example.com"
}
```

**Response (200):**
```json
{
  "mensagem": "Usuário atualizado com sucesso",
  "usuario": {
    "_id": "507f1f77bcf86cd799439011",
    "nome": "João Silva Santos",
    "email": "joao.silva@example.com",
    "dataCriacao": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros:**
- 401: Token não fornecido ou inválido
- 403: Acesso negado
- 400: Dados inválidos

---

### 5. PUT /auth/senha/:id
**Descrição:** Atualiza a senha do usuário (requer autenticação)

**Headers:**
```
Authorization: Bearer {token_jwt}
```

**Request:**
```json
{
  "senhaAnterior": "senha123",
  "novaSenha": "novaSenha456"
}
```

**Response (200):**
```json
{
  "mensagem": "Senha atualizada com sucesso"
}
```

**Erros:**
- 401: Token não fornecido ou inválido
- 403: Acesso negado
- 400: Senha anterior incorreta ou nova senha inválida

---

## Exemplo de Uso com JavaScript/Fetch

### Registrar usuário
```javascript
async function registrar() {
  const response = await fetch('http://localhost:3000/auth/registro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: 'senha123'
    })
  });
  const data = await response.json();
  console.log(data);
}
```

### Fazer login
```javascript
async function login() {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'joao@example.com',
      senha: 'senha123'
    })
  });
  const data = await response.json();
  console.log('Token:', data.token);
  localStorage.setItem('token', data.token); // Salvar token
  console.log('Usuário:', data.usuario);
}
```

### Buscar perfil do usuário
```javascript
async function buscarPerfil(usuarioId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:3000/auth/perfil/${usuarioId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  console.log(data);
}
```

### Atualizar perfil do usuário
```javascript
async function atualizarPerfil(usuarioId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:3000/auth/perfil/${usuarioId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: 'João Silva Santos',
      email: 'joao.silva@example.com'
    })
  });
  const data = await response.json();
  console.log(data);
}
```

### Atualizar senha
```javascript
async function atualizarSenha(usuarioId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:3000/auth/senha/${usuarioId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      senhaAnterior: 'senha123',
      novaSenha: 'novaSenha456'
    })
  });
  const data = await response.json();
  console.log(data);
}
```

---

## Instruções de Instalação

1. Instale as dependências:
```bash
npm install
```

2. Certifique-se que o MongoDB está rodando:
```bash
# Para MongoDB local
mongod
```

3. Inicie o servidor:
```bash
npm start
```

O servidor rodará em `http://localhost:3000`

---

## Segurança

⚠️ **IMPORTANTE:** Em produção:
- Mude o `JWT_SECRET` em `server.js` para uma chave segura
- Use HTTPS
- Configure CORS apropriadamente
- Implemente rate limiting
- Use variáveis de ambiente para configurações sensíveis
