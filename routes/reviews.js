const express = require('express')
const rount = express.Router()
const con = require('../database/db');
const { isLoggin } = require('../middleware')


rount.post('/:id/reviews', isLoggin, (req, res) => {
    const { rating, comment } = req.body;
    const id_user = res.locals.user;
    const { id } = req.params

    con.connect(function (err) {
        const sql = `INSERT INTO reviews (rating, comment, id_camp, id_user) VALUES ('${rating}', '${comment}', '${id}','${id_user}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    req.flash('sucess', 'Cread a new review!!!')
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
        req.flash('sucess', 'Sucessfully delete the review!!')
        res.redirect(`/campgrounds/${id}`)
    });
});

module.exports = rount