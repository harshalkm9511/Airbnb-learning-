const express = require("express");
const router = express.Router();

const Listing = require("../models/lists");
const Reviews = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const validateListing = require("../utils/validateListing");
const validateReview = require("../utils/validateReview");

// show listings
router.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find();
    res.render("./listings/home.ejs", { lists });
}));

//create Listing
router.get("/new", (req, res) => {
    res.render("./listings/form.ejs");
});
router.post("/new", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
}));

//edit Listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("./listings/update.ejs", { listing });
}));
router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    let updateListing = await Listing.findByIdAndUpdate(id, listing);
    if (!updateListing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.redirect(`/listing/${id}`);
}));

// create review
router.post("/:id/reviews", validateReview, wrapAsync(async (req, res) => {
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
router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
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

// delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.redirect("/");
}));

// Show Listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("./listings/show.ejs", { listing });
}));

module.exports = router;