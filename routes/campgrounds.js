const express = require('express')
const { campgroundSchema, reviewSchema } = require('../schemas')
const con = require('../database/db');
const { isLoggin } = require('../middleware')

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

router.get('/new', isLoggin, (req, res) => {
    res.render('campground/new')
});


router.get('/:id', isLoggin, (req, res) => {
    const { id } = req.params;
    const id_user = res.locals.user;

    con.query('SELECT * FROM camp WHERE id = ?', [id], function (err, results) {
        if (err) {
            throw err;
        }
        if (results.length === 0) {
            err = 'Not found'
            sta = '404'
            res.render('err', { sta, err });
        } else {
            con.query('SELECT r.*, u.username, u.id as id_user FROM reviews AS r JOIN user AS u ON r.id_user = u.id WHERE r.id_camp = ?;', [id], function (err, resultsReviews) {
                res.render('campground/show', { results, resultsReviews, id_user });
            })
        }
    });
});

router.get('/:id/edit', isLoggin, (req, res) => {
    const { id } = req.params;
    con.query(`SELECT * FROM camp WHERE id = ${id}`, function (err, results) {
        if (err) throw err;
        res.render('campground/edit', { results })
    });
});

router.post('/', isLoggin, (req, res) => {
    const { title, location, price, description, imgs } = req.body;
    const id_user = res.locals.user;
    const { error, value } = campgroundSchema.validate({ title, location, price, description, imgs });

    if (error) {
        const err = error.details[0].message;
        const sta = 400;
        return res.status(400).render('err', { err, sta });
    }

    const sql = 'INSERT INTO camp(title, location, price, description, imgs, id_user) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [value.title, value.location, value.price, value.description, value.imgs, id_user];

    con.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto no MySQL:', err);
            return res.status(500).send('Erro interno do servidor');
        }

        const id = results.insertId;
        req.flash('sucess', 'Sucessfully made a new campground');
        res.redirect(`/campgrounds/${id}`);
    });
});



router.delete('/:id', isLoggin, (req, res) => {
    const { id } = req.params;
    con.query(`DELETE FROM reviews WHERE id_camp = ${id}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor REVIWS');
            return;
        }
        con.query(`DELETE FROM camp WHERE id = ${id}`, (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Erro interno no servidor CAMP');
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
        req.flash('sucess', 'Sucessfully updated campground')
        res.redirect(`/campgrounds/${id}`)
    });
});

module.exports = router;