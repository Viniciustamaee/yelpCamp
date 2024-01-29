require('dotenv').config();
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session');
const port = 3000;
const methodOverride = require('method-override');
const passport = require('passport');
const passLocal = require('passport-local')


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/user')

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)



app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))



const sessionConfig = {
    secret: 'secredo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.loggin = req.user;
    res.locals.sucess = req.flash('sucess')
    res.locals.error = req.flash('error')
    next();
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds', reviews)
app.use('/', users)



app.listen(port, () => {
    console.log('A porta está conectada')
});