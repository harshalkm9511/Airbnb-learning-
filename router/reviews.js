const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/lists");
const Reviews = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const validateReview = require("../utils/validateReview");
const { isLoggedIn } = require("../middleware");

// create review
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing dose not exist");
    }

    let review = new Reviews(req.body.reviews);
    listing.reviews.push(review);
    await review.save();
    await listing.save();

    res.redirect(`/listing/${id}`);
}));
router.delete("/:reviewId",isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let updateListing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let deleteReview = await Reviews.findByIdAndDelete(reviewId);

    if (!updateListing) {
        throw new ExpressError(404, "Listing not found!");
    }
    if (!deleteReview) {
        throw new ExpressError(404, "Review not found!");
    }

    res.redirect(`/listing/${id}`);
}));

module.exports = router;
