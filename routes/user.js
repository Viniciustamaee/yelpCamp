const express = require('express');
const router = express.Router();
const con = require('../database/db');
const bcrypt = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO user (email, username, password) VALUES ('${email}', '${username}', '${passwordHash}')`;
        const result = await new Promise((resolve, reject) => {
            con.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
        req.flash('sucess', 'Welcome to Yelp Camp!!')
        res.redirect('/campgrounds');
    } catch (error) {
        const errorMessage = error.message;
        req.flash('error', errorMessage);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', successRedirect: "/campgrounds" }), (req, res) => {
    req.flash('success', 'deu certo')
    res.redirect('/campgrounds')
});

module.exports = router

