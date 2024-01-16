const express = require('express');
const app = express();
const port = 3000;
const con = require('./database/db');
const methodOverride = require('method-override');

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(port, () => {
    console.log(`A porta está conectada ${port}`)
})
