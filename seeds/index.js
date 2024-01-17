const con = require('../database/db');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelp');

const sample = array => array[Math.floor(Math.random() * array.length)];

con.connect(function (err) {
    if (err) throw err;
    console.log("Conectado!");
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const title = `${sample(descriptors)} ${sample(places)}`;
        const price = random1000;
        const description = 'bonito';
        const location = cities[random1000].state;

        var sql = 'INSERT INTO camp (title, price, description, location) VALUES (?, ?, ?, ?)';
        con.query(sql, [title, price, description, location], function (err, result) {
            if (err) throw err;
            console.log("1 registro inserido");
        });
    }
});
