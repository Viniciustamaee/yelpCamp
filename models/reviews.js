const con = require('../database/db');

con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS reviews (id INT PRIMARY KEY AUTO_INCREMENT,comment VARCHAR(255), rating int(5), id_user INT,id_camp INT,FOREIGN KEY(id_camp) REFERENCES camp(id),FOREIGN KEY(id_user) REFERENCES user(id) )";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table reviews created");
        }
    })
});


function insertReview({ rating, comment, id_camp, id_user }, callback) {
    const sql = 'INSERT INTO reviews (rating, comment, id_camp, id_user) VALUES (?, ?, ?, ?)';
    const values = [rating, comment, id_camp, id_user];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir a avaliação no MySQL:', err);
            return callback(err, null);
        }

        console.log('1 record inserted');
        callback(null, result);
    });
}

function deleteReview(reviewId, callback) {
    const sql = 'DELETE FROM reviews WHERE id = ?';

    con.query(sql, [reviewId], (error, results) => {
        if (error) {
            console.error('Erro ao excluir a avaliação no MySQL:', error);
            return callback(error, null);
        }

        callback(null, results);
    });
}

module.exports = {
    insertReview,
    deleteReview,
};