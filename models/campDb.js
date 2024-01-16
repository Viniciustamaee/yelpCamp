const con = require('./db');

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE camp", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});

