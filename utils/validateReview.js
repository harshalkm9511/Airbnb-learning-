const { reviewSchema } = require("../validators/schema");
const ExpressError = require("./ExpressError");

const validateReview = async (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(403, errMsg);
    }
    next();
}

module.exports = validateReview;

