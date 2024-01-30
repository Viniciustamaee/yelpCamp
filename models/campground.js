const con = require('../database/db');


con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS camp (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(50), price FLOAT, description VARCHAR(255), location VARCHAR(255), imgs VARCHAR(255),id_user INT,FOREIGN KEY(id_user) REFERENCES user(id))";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table camp created");
        }
    })
});

function selectAllCamp(callback) {
    const sql = "SELECT * FROM camp";
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

function selectCampById(id, callback) {
    const query = `SELECT * FROM camp WHERE id = ${id}`;

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return callback(err, null);
        }

        callback(null, results);
    });
}

function insertCampground({ title, location, price, description, imgs, id_user }, callback) {
    const sql = 'INSERT INTO camp(title, location, price, description, imgs, id_user) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, location, price, description, imgs, id_user];

    con.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto no MySQL:', err);
            return callback(err, null);
        }

        const id = results.insertId;
        callback(null, id);
    });
}

function updateCampground({ id, title, location, price, description, imgs }, callback) {
    const sql = `UPDATE camp SET title = ?, location = ?, price = ?, description = ?, imgs = ? WHERE id = ?`;
    const values = [title, location, price, description, imgs, id];

    con.query(sql, values, (error, results) => {
        if (error) {
            console.error('Erro ao atualizar o produto no banco de dados:', error);
            return callback(error, null);
        }

        callback(null, results);
    });
}

function deleteCampgroundAndReviews(id, callback) {
    con.query(`DELETE FROM reviews WHERE id_camp = ${id}`, (errorReviews, resultsReviews) => {
        if (errorReviews) {
            console.error(errorReviews);
            return callback(errorReviews, null);
        }

        con.query(`DELETE FROM camp WHERE id = ${id}`, (errorCamp, resultsCamp) => {
            if (errorCamp) {
                console.error(errorCamp);
                return callback(errorCamp, null);
            }

            callback(null, resultsCamp);
        });
    });
}

function getCampgroundDetails(id, callback) {
    con.query('SELECT * FROM camp WHERE id = ?', [id], (errCamp, resultsCamp) => {
        if (errCamp) {
            console.error(errCamp);
            return callback(errCamp, null, null);
        }

        if (resultsCamp.length === 0) {
            const error = 'Not found';
            const status = '404';
            return callback({ error, status }, null, null);
        }

        con.query('SELECT r.*, u.username, u.id as id_user FROM reviews AS r JOIN user AS u ON r.id_user = u.id WHERE r.id_camp = ?;', [id], (errReviews, resultsReviews) => {
            if (errReviews) {
                console.error(errReviews);
                return callback(errReviews, null, null);
            }

            callback(null, resultsCamp, resultsReviews);
        });
    });
}


module.exports = {
    selectAllCamp,
    selectCampById,
    insertCampground,
    updateCampground,
    deleteCampgroundAndReviews,
    getCampgroundDetails
};




