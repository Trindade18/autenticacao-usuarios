const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Carrega os usuários
const lerUsuarios = () => {
  if (!fs.existsSync("db.json")) return [];
  const data = fs.readFileSync("db.json", "utf8");
  try {
    return JSON.parse(data).usuarios || [];
  } catch {
    return [];
  }
};

const salvarUsuarios = (usuarios) => {
  fs.writeFileSync("db.json", JSON.stringify({ usuarios }, null, 2));
};

// Rota de cadastro
app.post("/cadastrar", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  const usuarios = lerUsuarios();

  if (usuarios.some(u => u.email === email)) {
    return res.status(400).json({ mensagem: "Email já cadastrado." });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  usuarios.push({ nome, email, telefone, senha: senhaCriptografada });

  salvarUsuarios(usuarios);
  res.json({ mensagem: "Você foi cadastrado! Por favor, faça login." });
});

// Rota de login
app.post("/login", async (req, res) => {
  const { nome, sobrenome, senha } = req.body;

  if (!nome || !sobrenome || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  const nomeCompleto = `${nome} ${sobrenome}`.toLowerCase();
  const usuarios = lerUsuarios();

  const usuario = usuarios.find(u => u.nome.toLowerCase() === nomeCompleto);
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  res.json({ mensagem: "Login realizado com sucesso!" });
});

// Inicializa servidor
app.listen(PORT, () => console.log(`Servidor rodando: http://localhost:${PORT}`));
