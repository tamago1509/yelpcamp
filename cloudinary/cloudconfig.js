const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({

    cloud_ulr: process.env.CLOUDINARY_URL
});

// const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yelpcamp',
        allowedFormats: ['jpeg', 'png', 'jpg']

    }
})
module.exports = { storage, cloudinary };