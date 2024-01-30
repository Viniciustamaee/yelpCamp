const User = require('../models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();



module.exports.scrennRegister = (req, res) => {
    res.render('users/register')
}


module.exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        await User.registerUser(email, username, password);
        req.flash('success', 'Registration complete');
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        const errorMessage = error.message || 'An error occurred during registration.';
        req.flash('error', errorMessage);
        res.redirect('/register');
    }
}

module.exports.screenLogin = (req, res) => {
    res.render('users/login')
}

module.exports.valid = function (user, done) {
    done(null, user);
}

module.exports.passwordValid = new LocalStrategy(async function (username, password, done) {
    try {
        const rows = await User.findUserByUsername(username);

        if (rows.length === 0) {
            return done(null, false, { message: 'Usuário não encontrado.' });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return done(null, user.id);
        } else {
            return done(null, false, { message: 'Senha incorreta.' });
        }
    } catch (error) {
        return done(error);
    }
})

module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Usuário não encontrado ou senha incorreta.');
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            req.flash('sucess', 'Bem-vindo ao YelpCamp');
            return res.redirect('/campgrounds');
        });
    })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error(err);
        }
        req.flash('sucess', 'Goodbye!!!');
        res.redirect('/campgrounds');
    });
}