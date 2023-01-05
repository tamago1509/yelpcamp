const Campground = require("../models/yelpcamp");
const Review = require('../models/rate');
const { cloudinary } = require('../cloudinary/cloudconfig');


module.exports.getAllCamp = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })

}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.createNewCamp = async (req, res) => {
    // console.log(req.files)
    if (req.body.campground.title === '') {
        throw new ExpressError("Title is required field", 500);
    }
    const camp = new Campground(req.body.campground);
    camp.images = await req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    // console.log(camp);
    req.flash("success", "Successfully added a new camp")

    // console.log(req.flash('success'))
    res.redirect(`/campgrounds/${camp._id}`);
}


module.exports.getEditCampForm = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const campground = await Campground.findById(id);
    // console.log(campground)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campground/${id}`);
    }

    return res.render('campgrounds/edit', { camp: campground });
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this!!!');
        return res.redirect(`/campground/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('error', 'The campground has been deleted!!!')
    res.redirect('/campgrounds');
}



module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(req.user)

    // console.log(req.files);
    const image = await req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...image);
    await campground.save();
    // console.log(req.body.deleteImages);
    if (req.body.deleteImages?.length) {
        console.log('called')
        for (const filename of req.body.deleteImages) {
            console.log('called loop', filename, filename.split('/'))
            try {
                const result = await cloudinary.uploader.destroy(filename);
                console.log(result)
                await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
            } catch (error) {
                console.log(error)
            }
        }

    }
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    // // console.log(camp)
    req.flash("success", "Successfully updated the camp")
    res.redirect(`/campgrounds/${camp._id}`)

}
module.exports.showCamp = async (req, res) => {
    if (!req.params) {
        throw new ExpressError("There is no ID", 404);
    }
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author').populate('images');
    if (!camp) {
        req.flash('error');
        return res.redirect('/campgrounds');
    }
    // console.log(camp.images);
    res.render('campgrounds/show', { camp });
}