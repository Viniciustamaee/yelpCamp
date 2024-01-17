require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const con = require('./database/db');
const methodOverride = require('method-override');


app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

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
    const { id } = req.params
    let sql = `DELETE FROM camp WHERE id = ${id}`;
    con.query(sql, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.redirect('/campgrounds')
    })
});


app.post('/campgrounds', (req, res) => {
    const { title, location } = req.body
    const sql = 'INSERT INTO camp (title, location) VALUES (?, ?)';
    const values = [title, location];
    con.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto no MySQL:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.redirect('/campgrounds')
    });
})

app.get('/campgrounds/:id', (req, res) => {
    const { id } = req.params;
    con.query(`SELECT * FROM camp WHERE id = ${id}`, function (err, results) {
        if (err) throw err;
        res.render('campground/show', { results })
    })
})


app.put('/campgrounds/:id', (req, res) => {
    const { id } = req.params;
    const { title, location } = req.body
    const sql = `UPDATE camp SET title = '${title}', location = '${location}' WHERE id = '${id}'`;
    con.query(sql, (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao atualizar o produto no banco de dados.' });
        }
        console.log('Produto atualizado com sucesso:', results);
        res.redirect('/campgrounds')
    });
});


app.get('/campgrounds/:id/edit', (req, res) => {
    const { id } = req.params;
    con.query(`SELECT * FROM camp WHERE id = ${id}`, function (err, results) {
        if (err) throw err;
        res.render('campground/edit', { results })
    })
})



app.listen(port, () => {
    console.log('A porta está conectada')
})
