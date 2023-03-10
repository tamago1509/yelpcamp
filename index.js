if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require('path');
var methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const campgrounds = require('./routers/campgrounds');
const reviews = require('./routers/reviews');
const { CampSchema, ReviewSchema } = require('./schemas')
const ExpressError = require('./views/utils/ExpressError')
const catchAsync = require('./views/utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
// const flash = require('req-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');
var cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;





// console.log(process.env.CLOUDINARY_KEY);


const userRouter = require('./routers/user');


app.use(cookieParser())

const mongoose = require("mongoose");

const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {

        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
}

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    // res.locals.url = ;
    // console.log("aaa", req.session.returnTo);

    next();
})
mongoose.connect("mongodb://localhost:27017/camps", {
    useNewUrlParser: true,
    UseUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB connected");
})

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render('home');
})



app.use('/campgrounds', campgrounds);
app.use('/reviews/:id', reviews);
app.use('/users', userRouter);


app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found!!", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!!!";
    res.status(statusCode).render('campgrounds/error', { err });

})
app.listen(8000, () => {
    console.log("It is connected with port 8000!!!")
});
