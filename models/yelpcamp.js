const Review = require("./rate");
// const userSchema = require('./user');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({

    url: String,
    filename: String

})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const campSchema = new Schema({
    title:
    {
        type: String
    },
    images: [imageSchema]
    ,
    price:
    {
        type: Number
    }
    ,
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    }
    ,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        }

    ]

})

campSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const Campground = mongoose.model("Campground", campSchema);



module.exports = Campground; 