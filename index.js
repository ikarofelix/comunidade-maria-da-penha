const express = require("express");
const app = express();
const session = require("express-session");
const uuid = require('node-uuid');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const crypto = require('crypto');
const https = require("https");
const fs = require("fs");

mongoose.connect("mongodb+srv://riopretoduarte:3Hj1fV31VBS7Q5tM@cluster0.f8zeufb.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  telefone: String,
  genero: String,
  data_nascimento: String,
  cidade: String,
  estado: String,
  tema: String,
  registrado: {
    type: Boolean,
    default: false
  },
  permissao: {
    type: String,
    default: 'acesso normal',
    enum: ['acesso normal', 'bloqueado', 'expulso do chat']
  }
});

const Users = mongoose.model('Users', UserSchema);

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secret = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 246060*1000 },
  genid: () => uuid.v4(),
}));

// Rotas aqui
app.get('/get-cookie', (req, res) => {
  res.send(req.session.cookie);
});

app.get("/registro", (req, res) => {
  res.render("index");
});

app.post("/registro", async (req, res) => {
  const novoDocumento = new Users(req.body);
  await novoDocumento.save();
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", async (req, res) => {
  const usuario = await Users.findOne({ email: req.body.email });
  if (usuario && usuario.senha == req.body.senha) {
      res.redirect("/page");
  } else {
      res.send("Usuário ou senha incorretos");
  }
});

app.get("/page", (req, res) => {
  res.render("page");
});

app.get('/meuperfil', async (req, res) => {
  res.render('meuperfil')
  try {
    const usuario = await Users.findOne();

    if (!usuario) {
      // Criar um novo perfil e definir Registrado como true
      const novoUsuario = new usuario({ nome: usuario, Registrado: true });
      await novoUsuario.save();

      res.redirect('/escolha-seu-tema');
    } else if (usuario.Registrado) {
      res.redirect('/escolha-seu-tema');
    } else {
      // Atualizar o perfil para Registrado true
      usuario.Registrado = true;
      await usuario.save();

      // Fazer outras ações necessárias para registro
      // ...

      res.redirect('/escolha-seu-tema');
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro interno do servidor');
  }
});
app.get("/escolha-seu-tema", (req, res) => {
  res.render("temas");
});

// Incluindo as rotas restantes do seu código
app.get("/contato", (req, res) => {
  res.render("contato");
});

app.get("/perfil", (req, res) => {
  res.render("perfil");
});

app.get("/suporte", (req, res) => {
  res.render("suporte");
});

app.get("/recuperacao-senha", (req, res) => {
  res.render("recuperar");
});

app.get("/duvidas-frequentes", (req, res) => {
  res.render("duvidas");
});

app.get("/regras", (req, res) => {
  res.render("regras");
});

app.get("/tutorial", (req, res) => {
  res.render("tutorial");
});

app.get('/salas3', (req, res) => {
  res.render('salas3');
});

app.get('/salas4', (req, res) => {
  res.render('salas4');
});

app.get('/salas2', (req, res) => {
  res.render('salas2');
});

app.get('/salas5', (req, res) => {
  res.render('salas5');
});

app.get('/salas1', (req, res) => {
  res.render('salas1');
});

app.get('/salas6', (req, res) => {
  res.render('salas6');
});

app.get('/gerenciamento', (req, res) => {
  res.render('gerenciamento');
});

app.get('/login-adm', (req, res) => {
  res.render('logingerenciamento');
});

app.get('/logs', (req, res) => {
  res.render('logs');
});
app.use(function(req, res) {
  res.status(404).redirect("/404")
});

app.put("/usuario/:id/bloquear", async (req, res) => {
  const usuario = await Users.findById(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuário não encontrado");
    return;
  }
  usuario.permissao = 'bloqueado';
  await usuario.save();
  res.redirect("/");
});

app.put("/usuario/:id/expulsar", async (req, res) => {
  const usuario = await Users.findById(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuário não encontrado");
    return;
  }
  usuario.permissao = 'expulso do chat';
  await usuario.save();
  res.redirect("/");
});

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificado.pem'),
};

https.createServer(options, app).listen(process.env.PORT || 443, () => {
  console.log('[EXPRESS] Iniciado, Porta: 443 | https://localhost:443/');
});
