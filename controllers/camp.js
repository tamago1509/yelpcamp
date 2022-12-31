const Campground = require("../models/yelpcamp");

module.exports.getNewCamp = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })

}