const con = require('./database/db');

function selectAll() {
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM camp", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}

module.exports = selectAll
