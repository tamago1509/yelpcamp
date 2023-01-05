const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const { route } = require('./reviews');
const session = require('express-session');
const user = require('./../controllers/user');


router.route('/register')
    .get(user.showRegisterForm)
    .post(user.registerUser)

router.get('/login', user.showLoginForm)

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', keepSessionInfo: true, failureFlash: true }), user.login);

router.get('/logout', user.logout);

module.exports = router;