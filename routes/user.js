const express = require('express');
const router = express.Router();
const passport = require('passport')
const userControll = require('../controllers/user')


router.get('/register', userControll.scrennRegister)
router.post('/register', userControll.register);
router.get('/login', userControll.screenLogin);

passport.serializeUser(userControll.valid);
passport.deserializeUser(userControll.valid);

passport.use(userControll.passwordValid);
router.post('/login', userControll.login);
router.get('/logout', userControll.logout);

module.exports = router

