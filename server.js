const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./database');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const saltRounds = 10;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(__dirname));

app.use(session({

  secret: 'moapfsd4a8fh1a6bfs8ag1',
  resave: false,
  saveUninitialized: false,
  cookie: {
        maxAge: 1000*60*60*24
      }
}));


app.post('/cadastrar', (req, res) => {
    const { name, email, password, phone } = req.body;

    // 1. Gerar o hash da senha antes de salvar no DB
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao gerar hash da senha para cliente:', err);
            return res.status(500).send('Erro interno do servidor ao cadastrar usuário.');
        }

        const query = 'INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
        const values = [name, email, hash, phone]; // <--- AGORA SALVA O HASH!

        connection.query(query, values, (insertErr, result) => {
            if (insertErr) {
                console.error('Erro ao inserir dados do cliente:', insertErr);
                // Você pode querer verificar se o erro é por email duplicado (ER_DUP_ENTRY)
                return res.status(500).send('Erro ao cadastrar usuário: ' + insertErr.message);
            }
            res.status(201).send('Usuário cadastrado com sucesso!');
        });
    });
});

app.post('/cadastrarP', (req, res) => {
    const { name, email, password, phone, especialidade, description } = req.body;

    // 1. Gerar o hash da senha antes de salvar no DB
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao gerar hash da senha para prestador:', err);
            return res.status(500).send('Erro interno do servidor ao cadastrar prestador.');
        }

        const query = 'INSERT INTO freelancers (nome, email, senha, telefone, especialidade, descricao) VALUES (?,?,?,?,?,?)';
        const values = [name, email, hash, phone, especialidade, description]; // <--- AGORA SALVA O HASH!

        connection.query(query, values, (insertErr, result) => {
            if (insertErr) {
                console.error('Erro ao inserir dados do prestador:', insertErr);
                return res.status(500).send('Erro ao cadastrar prestador: ' + insertErr.message);
            }
            res.status(201).send('Prestador cadastrado com sucesso!');
        });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // --- TENTAR AUTENTICAR COMO CLIENTE ---
    const queryCliente = 'SELECT id, email, senha FROM clientes WHERE email = ?';
    connection.query(queryCliente, [email], (errCliente, resultsCliente) => {
        if (errCliente) {
            console.error('Erro ao buscar cliente para login:', errCliente);
            return res.status(500).send('Erro interno do servidor.');
        }

        // Se encontrou um cliente com o email
        if (resultsCliente.length > 0) {
            const userCliente = resultsCliente[0];
            const storedHashCliente = userCliente.senha;

            bcrypt.compare(password, storedHashCliente, (compareErrCliente, isMatchCliente) => {
                if (compareErrCliente) {
                    console.error('Erro ao comparar senhas de cliente:', compareErrCliente);
                    return res.status(500).send('Erro interno do servidor.');
                }

                if (isMatchCliente) {
                    // Login de CLIENTE bem-sucedido
                    req.session.userId = userCliente.id;
                    req.session.userEmail = userCliente.email;
                    req.session.userType = 'cliente'; // Define o tipo de usuário
                    console.log(`Cliente logado com sucesso: ${userCliente.email} (ID: ${userCliente.id})`);
                    return res.status(200).send('Login bem-sucedido como cliente!');
                } else {
                    // Senha do cliente incorreta, procede para tentar como freelancer
                    tryLoginFreelancer();
                }
            });
        } else {
            // Cliente não encontrado com esse email, tenta como freelancer
            tryLoginFreelancer();
        }
    });

    // --- FUNÇÃO AUXILIAR PARA TENTAR AUTENTICAR COMO FREELANCER ---
    function tryLoginFreelancer() {
        const queryFreelancer = 'SELECT id, email, senha FROM freelancers WHERE email = ?';
        connection.query(queryFreelancer, [email], (errFreelancer, resultsFreelancer) => {
            if (errFreelancer) {
                console.error('Erro ao buscar freelancer para login:', errFreelancer);
                return res.status(500).send('Erro interno do servidor.');
            }

            // Se encontrou um freelancer com o email
            if (resultsFreelancer.length > 0) {
                const userFreelancer = resultsFreelancer[0];
                const storedHashFreelancer = userFreelancer.senha;

                bcrypt.compare(password, storedHashFreelancer, (compareErrFreelancer, isMatchFreelancer) => {
                    if (compareErrFreelancer) {
                        console.error('Erro ao comparar senhas de freelancer:', compareErrFreelancer);
                        return res.status(500).send('Erro interno do servidor.');
                    }

                    if (isMatchFreelancer) {
                        // Login de FREELANCER bem-sucedido
                        req.session.userId = userFreelancer.id;
                        req.session.userEmail = userFreelancer.email;
                        req.session.userType = 'freelancer'; // Define o tipo de usuário
                        console.log(`Freelancer logado com sucesso: ${userFreelancer.email} (ID: ${userFreelancer.id})`);
                        return res.status(200).send('Login bem-sucedido como prestador!');
                    } else {
                        // Senha do freelancer incorreta
                        return res.status(401).send('Email ou senha inválidos.');
                    }
                });
            } else {
                // Nem cliente nem freelancer encontrados com esse email
                return res.status(401).send('Email ou senha inválidos.');
            }
        });
    }
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
