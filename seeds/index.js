const express = require("express");
const app = express();
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');


const mongoose = require("mongoose");
const Campground = require("../models/yelpcamp");


mongoose.connect("mongodb://localhost:27017/camps", {
    useNewUrlParser: true,
    UseUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const Ran1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "63adb32a5e0cfdf61892e451",
            location: `${cities[Ran1000].city}, ${cities[Ran1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            img: "https://source.unsplash.com/featured/300x203",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, sequi libero iure dolor tempore repudiandae molestias assumenda quis architecto autem, saepe natus id sint ab iusto enim eum aliquid pariatur?",
            price

        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close();
});