const Joi = require('joi');
module.exports.CampSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        img: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        location: Joi.string().required()

    })
}).required();

module.exports.ReviewSchema = Joi.object({
    reviews: Joi.object({
        rate: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
}).required();
