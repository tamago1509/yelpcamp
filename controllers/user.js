const User = require("../models/user");
const passport = require('passport');
const { func } = require("joi");
const { isLoggedIn } = require('../middleware');

module.exports.showRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err, next) => {
        if (err) { next(err) };
        req.flash('success', 'Successfully registered!!!')
        return res.redirect("/campgrounds")


    })

}

module.exports.showLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const currentUrl = req.session.returnTo || "/campgrounds"
    // console.log('bbb', req.session.returnTo)
    // console.log(currentUrl);
    req.flash('success', "Welcome back")
    delete req.session.returnTo;
    res.redirect(currentUrl);

}


module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye! See you later!!!")
        res.redirect('/users/login');
    });
}