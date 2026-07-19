const listingSchema = require("../schema");
const ExpressError = require("./ExpressError");

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw ExpressError(403, errMsg);
    }
    next();
};

module.exports = validateListing;