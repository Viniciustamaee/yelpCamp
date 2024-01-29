const con = require('../database/db');

con.connect(function () {
    let sql = "CREATE TABLE IF NOT EXISTS reviews (id INT PRIMARY KEY AUTO_INCREMENT,comment VARCHAR(255), rating int(5), id_user INT,id_camp INT,FOREIGN KEY(id_camp) REFERENCES camp(id),FOREIGN KEY(id_user) REFERENCES user(id) )";
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table created");
        }
    })
});