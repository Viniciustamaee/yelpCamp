const express = require('express')
const rount = express.Router()
const con = require('../database/db');




rount.post('/:id/reviews', (req, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params
    con.connect(function (err) {
        const sql = `INSERT INTO reviews (rating, comment, id_camp) VALUES ('${rating}', '${comment}', '${id}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    console.log(req.body, req.params)
    res.redirect(`/campgrounds/${id}`)
});

rount.delete('/:id/reviews/:reviewId', (req, res) => {
    const { id, reviewId } = req.params
    con.query(`DELETE FROM reviews WHERE id = ${reviewId}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.redirect(`/campgrounds/${id}`)
    });
});

module.exports = rount