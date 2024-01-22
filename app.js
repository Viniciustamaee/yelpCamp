require('dotenv').config();
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const port = 3000;
const { campgroundSchema, reviewSchema } = require('./schemas')
const con = require('./database/db');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressErr');

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', (req, res) => {
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

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new')
});

app.delete('/campgrounds/:id', (req, res) => {
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


app.post('/campgrounds', (req, res) => {
    const { title, location, price, description, imgs } = req.body;
    const { error, value } = campgroundSchema.validate({ title, location, price, description, imgs });
    if (error) {
        const err = (error.details[0].message)
        const status = 400
        return res.status(400).render('err', { err, status });
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

app.post('/campgrounds/:id/reviews', (req, res) => {
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
})

app.delete('/campgounds/:id/reviews/:reviewId', (req, res) => {
    const { reviewId, id } = req.params
    con.query(`DELETE FROM reviews WHERE id = ${reviewId}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.redirect(`/campgrounds/${id}`)
    });
})



app.get('/campgrounds/:id', (req, res) => {
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

app.put('/campgrounds/:id', (req, res) => {
    const { id } = req.params;
    const { title, location, price, description, imgs } = req.body
    const { error: infoError, value: validatedInfo } = campgroundSchema.validate({ title, location, price, description, imgs });

    if (infoError) {
        const err = (infoError.details[0].message)
        const status = '400'
        return res.status(400).render('err', { err, status });
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

app.get('/campgrounds/:id/edit', (req, res) => {
    const { id } = req.params;
    con.query(`SELECT * FROM camp WHERE id = ${id}`, function (err, results) {
        if (err) throw err;
        res.render('campground/edit', { results })
    });
});

app.use((err, req, res, next) => {
    if (err.statusCode === 404) {
        const err = 'Not found'
        const status = '404'
        return res.status(404).render('err', { err, status });
    }
});

app.listen(port, () => {
    console.log('A porta está conectada')
});
