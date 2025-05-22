const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',     // Seu host MySQL (geralmente localhost)
    user: 'root',   // Seu nome de usuário do MySQL
    password: 'root', // Sua senha do MySQL
    database: 'ajudae' // O nome do seu banco de dados
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado ao MySQL como ID ' + connection.threadId);
});

module.exports = connection;