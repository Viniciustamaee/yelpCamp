require('dotenv').config();
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session');
const port = 3000;
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)



app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

const sessionConfig = {
    secret: 'secredo',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())


app.use((req, res, next) => {
    res.locals.sucess = req.flash('sucess')
    res.locals.error = req.flash('error')
    next();
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds', reviews)



app.listen(port, () => {
    console.log('A porta está conectada')
});