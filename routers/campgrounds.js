const express = require('express');
const { model } = require('mongoose');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../views/utils/catchAsync');
const ExpressError = require('../views/utils/ExpressError')
const Campground = require("../models/yelpcamp");
// const flash = require('req-flash');
const flash = require('connect-flash');
const Review = require('../models/rate');
const { isLoggedIn, isAuthor } = require('../middleware');
const camp = require('../controllers/camp');
// const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { storage } = require('../cloudinary/cloudconfig')
const upload = multer({ storage })





router.put('/:id/edit', isLoggedIn, isAuthor, upload.array('campground[images]'), camp.editCamp)
router.delete('/:id', isLoggedIn, catchAsync(camp.deleteCamp))
router.post('/', upload.array('campground[images]'), camp.createNewCamp)

// /campgrounds/63b1454eb7e35f3c2da6d367/edit
router.get("/", isLoggedIn, catchAsync(camp.getAllCamp));
router.get('/new', isLoggedIn, camp.showNewForm)

router.get('/:id/edit', isLoggedIn, catchAsync(camp.getEditCampForm))
router.get('/:id', isLoggedIn, catchAsync(camp.showCamp))

module.exports = router;
// catchAsync(camp.createNewCamp))