const con = require('../database/db');
const imgUrl = 'https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

con.connect(function (err) {
    if (err) {
        console.error('Erro na conexão com o banco de dados: ' + err.stack);
        return;
    }

    console.log('Conectado ao banco de dados com ID ' + con.id);

    for (let id = 4; id <= 52; id++) {
        const sql = `INSERT INTO sua_tabela (id, imgs) VALUES (${id}, '${imgUrl}')`;

        con.query(sql, function (err, result) {
            if (err) {
                console.error(`Erro ao inserir para ID ${id}: ${err.message}`);
            } else {
                console.log(`Registro inserido para ID ${id}`);
            }
        });
    }
});
