require('dotenv').config();
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const port = 3000;
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)

app.use('/campgrounds', campgrounds);
app.use('/campgrounds', reviews)


app.listen(port, () => {
    console.log('A porta está conectada')
});
