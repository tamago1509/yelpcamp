const express = require('express');
const { model } = require('mongoose');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../views/utils/catchAsync');
const ExpressError = require('../views/utils/ExpressError')
const Campground = require("../models/yelpcamp");
// const flash = require('req-flash');
const flash = require('connect-flash');
const Review = require('../models/rate');
const { isLoggedIn } = require('../middleware');
const getNewCamp = require('../controllers/camp');


router.get("/", isLoggedIn, catchAsync(getNewCamp));

router.put('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campground/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated the camp")
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campground/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('error', 'The campground has been deleted!!!')
    res.redirect('/campgrounds');
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.post('/', catchAsync(async (req, res) => {
    if (req.body.campground.title === '') {
        throw new ExpressError("Title is required field", 500);
    }
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully added a new camp")

    // console.log(req.flash('success'))
    res.redirect(`/campgrounds/${camp._id}`);
}))
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
}))
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    if (!req.params) {
        throw new ExpressError("There is no ID", 404);
    }
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!camp) {
        req.flash('error');
        res.redirect('/campgrounds');
    }
    camp.reviews.forEach(element => {
        console.log(element.author)
    });
    res.render('campgrounds/show', { camp });
}))

module.exports = router;