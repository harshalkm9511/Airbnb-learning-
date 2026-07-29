const joi = require("joi");

const listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        image: joi.string().allow("", null).required(),
        price : joi.number().integer().required(),
        location: joi.string().required(),
        country: joi.string().required()
    }),
});


const reviewSchema = joi.object({
    reviews : joi.object({
        comment:joi.string().pattern(/[a-zA-Z]/).required(),
        rating: joi.number().min(1).max(5)
    })
});
module.exports = {reviewSchema,listingSchema};