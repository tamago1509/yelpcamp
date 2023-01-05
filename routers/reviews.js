const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../views/utils/catchAsync');
const ExpressError = require('../views/utils/ExpressError')
const { ReviewSchema } = require('../schemas')
const flash = require('connect-flash');

const Campground = require("../models/yelpcamp");
const Review = require('../models/rate');
const { isLoggedIn, validateReview } = require('../middleware');
const review = require('../controllers/review');


router.put('/addreview', isLoggedIn, validateReview, catchAsync(review.addNewReview))

router.delete("/deletereview/:reviewId", isLoggedIn, catchAsync(review.deleteReview))


module.exports = router;