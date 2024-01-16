const mysql = require('mysql2')
require('dotenv').config();

const con = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: '1234',
    database: 'primeiraTabela'
});

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = con