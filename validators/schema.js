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

module.exports = listingSchema;