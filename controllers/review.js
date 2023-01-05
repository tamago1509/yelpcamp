const Campground = require("../models/yelpcamp");
const Review = require('../models/rate');

module.exports.addNewReview = async (req, res) => {

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
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    const camp = await Campground.findById(id);
    // console.log(camp);
    req.flash("error", "Deleted the review")
    res.redirect(`/campgrounds/${id}`);

}