const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(
            'Trending',
            'Iconic Cities',
            'Mountains',
            'Castles',
            'Camps',
            'Amazing Pools',
            'Lake Side',
            'Arctic'
        ).required(), // Add the category field here
        image: Joi.object({
            url: Joi.string(),
            filename: Joi.string()
        }).optional()
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});
