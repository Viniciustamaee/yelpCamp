const con = require('../database/db');
const salts = 10;
const bcrypt = require('bcrypt');



con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS user (id INT PRIMARY KEY AUTO_INCREMENT,email VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table user created");
        }
    })
});



async function registerUser(email, username, password) {
    try {
        const passwordHash = await bcrypt.hash(password, salts);

        const sql = 'INSERT INTO user (email, username, password) VALUES (?, ?, ?)';
        const values = [email, username, passwordHash];

        return new Promise((resolve, reject) => {
            con.query(sql, values, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    } catch (error) {
        throw error;
    }
}

async function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM user WHERE username=?', [username], function (err, rows) {
            if (err) reject(err);
            resolve(rows);
        });
    });
}


module.exports = {
    registerUser,
    findUserByUsername
};