const express = require('express')
const { campgroundSchema, reviewSchema } = require('../schemas')
const con = require('../database/db');

const router = express.Router();

router.get('/', (req, res) => {
    const sql = "SELECT * FROM camp";
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).send('Erro ao obter os produtos');
            return;
        }
        res.render("campground/index", { results })
    });
});

router.get('/new', (req, res) => {
    res.render('campground/new')
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    con.query('SELECT * FROM camp WHERE id = ?', [id], function (err, results) {
        if (err) {
            throw err;
        }
        if (results.length === 0) {
            err = 'Not found'
            sta = '404'
            res.render('err', { sta, err });
        } else {
            con.query('SELECT * FROM reviews WHERE id_camp = ?', [id], function (err, resultsReviews) {
                res.render('campground/show', { results, resultsReviews });
            })
        }
    });
});

router.get('/:id/edit', (req, res) => {
    const { id } = req.params;
    con.query(`SELECT * FROM camp WHERE id = ${id}`, function (err, results) {
        if (err) throw err;
        res.render('campground/edit', { results })
    });
});

router.post('/', (req, res) => {
    const { title, location, price, description, imgs } = req.body;
    const { error, value } = campgroundSchema.validate({ title, location, price, description, imgs });
    if (error) {
        const err = (error.details[0].message)
        const sta = 400
        return res.status(400).render('err', { err, sta });
    }
    const sql = 'INSERT INTO camp(title, location, price, description, imgs) VALUES (?, ?, ?, ?, ?)';
    const values = [value.title, value.location, value.price, value.description, value.imgs];
    con.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto no MySQL:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.redirect('/campgrounds');
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    con.query(`DELETE FROM reviews WHERE id_camp = ${id}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        con.query(`DELETE FROM camp WHERE id = ${id}`, (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Erro interno no servidor');
                return;
            }
            res.redirect('/campgrounds');
        });
    });
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, location, price, description, imgs } = req.body
    const { error: infoError, value: validatedInfo } = campgroundSchema.validate({ title, location, price, description, imgs });

    if (infoError) {
        const err = (infoError.details[0].message)
        const sta = '400'
        return res.status(400).render('err', { err, sta });
    }
    const sql = `UPDATE camp SET title = '${title}', location = '${location}', price = '${price}', description = '${description}', imgs = '${imgs}' WHERE id = '${id}'`;
    con.query(sql, (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao atualizar o produto no banco de dados.' });
        }
        console.log('Produto atualizado com sucesso:');
        res.redirect('/campgrounds')
    });
});

module.exports = router;