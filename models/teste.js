const con = require('../database/db');


con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS teste (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(50), price FLOAT, description VARCHAR(255), location VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table created");
        }
    })
});


