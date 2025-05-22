const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./database');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(__dirname));


app.post('/cadastrar', (req, res) => {
  const { name, email, password, phone } = req.body;

  const query = 'INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
  const values = [name, email, password, phone];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send('Erro ao cadastrar usuário' + err.message);
    }
    res.send('Usuário cadastrado com sucesso!');
  });
});

app.post('/cadastrarP', (req,res) => {
    const {name, email, password, phone, especialidade, description } = req.body;

    const query = 'INSERT INTO freelancers (nome, email, senha, telefone, especialidade, descricao) VALUES (?,?,?,?,?,?)';
    const values = [name, email, password, phone, especialidade, description ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).send('Erro ao cadastrar prestador' + err.message);
        }     
        res.send('Prestador cadastrado com sucesso!');
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM clientes WHERE email = ? AND senha = ?';
  const values = [email, password];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).send('Erro interno do servidor');
    }

    if (results.length > 0) {
      // Usuário encontrado
      res.send('Login bem-sucedido!');
    } else {
      // Nenhum usuário com esse email/senha
      res.status(401).send('Email ou senha inválidos');
    }
  });
});


app.get('/buscar-prestadores', (req, res) => {
  const especialidade = req.query.especialidade;

  if (!especialidade) {
    return res.status(400).send('Especialidade não fornecida');
  }

  const query = 'SELECT * FROM freelancers WHERE especialidade LIKE ?';
  const values = [`%${especialidade}%`];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar prestadores:', err);
      return res.status(500).send('Erro ao buscar prestadores');
    }

    console.log(results);
    res.json(results);
  });
});

app.get('/buscaProfissionais', (req, res) => {
  res.sendFile(path.join(__dirname, 'buscaProfissionais.html'));
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
