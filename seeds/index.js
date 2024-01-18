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
        const imgs = 'https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

        var sql = 'INSERT INTO camp (title, price, description, location, imgs) VALUES (?, ?, ?, ?, ?)';
        con.query(sql, [title, price, description, location, imgs], function (err, result) {
            if (err) throw err;
            console.log("1 registro inserido");
        });
    }
});
