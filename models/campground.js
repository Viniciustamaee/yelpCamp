const con = require('../database/db');


con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS camp (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(50), price FLOAT, description VARCHAR(255), location VARCHAR(255), imgs VARCHAR(255),id_user INT,FOREIGN KEY(id_user) REFERENCES user(id))";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table created");
        }
    })
});


