const { ReviewSchema } = require('./schemas')
const ExpressError = require('./views/utils/ExpressError')
const Campground = require('./models/yelpcamp')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must log in first!");
        return res.redirect('/users/login');
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}