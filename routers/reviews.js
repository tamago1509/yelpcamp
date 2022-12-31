const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../views/utils/catchAsync');
const ExpressError = require('../views/utils/ExpressError')
const { ReviewSchema } = require('../schemas')
const flash = require('connect-flash');

const Campground = require("../models/yelpcamp");
const Review = require('../models/rate');
const { isLoggedIn } = require('../middleware');



const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}
router.put('/addreview', isLoggedIn, validateReview, catchAsync(async (req, res) => {

    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    const reviewBody = new Review(req.body.reviews);
    camp.reviews.push(reviewBody);
    reviewBody.author = req.user._id;
    await reviewBody.save();
    await camp.save();
    req.flash("success", "Successfully created a new review")
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete("/deletereview/:reviewId", isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    const camp = await Campground.findById(id);
    // console.log(camp);
    req.flash("error", "Deleted the review")
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;