const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const User = require("../models/user");
const passport = require('passport');
const { route } = require('./reviews');
const session = require('express-session');



router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err, next) => {
        if (err) { next(err) };
        req.flash('success', 'Successfully registered!!!')
        return res.redirect("/campgrounds")


    })

})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', keepSessionInfo: true }),
    function (req, res) {
        req.flash('success', "Welcome back")
        const currentUrl = req.session.returnTo || "/campgrounds"
        // console.log('bbb', req.session.returnTo)
        // console.log(currentUrl);
        delete req.session.returnTo;
        res.redirect(currentUrl);
    })
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye! See you later!!!")
        res.redirect('/users/login');
    });
});

module.exports = router;