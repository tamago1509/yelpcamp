// const Review = require("./rate");
// const userSchema = require('./user');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campSchema = new Schema({
    title:
    {
        type: String
    },
    img: String
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