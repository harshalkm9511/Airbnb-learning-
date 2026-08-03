const express = require("express");
const router = express.Router();
const flash = require("connect-flash");

const Listing = require("../models/lists");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const validateListing = require("../utils/validateListing");


// show listings
router.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find();
    res.render("./listings/home.ejs", { lists });
}));

//create Listing
router.get("/new", (req, res) => {
    res.render("./listings/form.ejs");
});
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/");
}));

//edit Listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing dose not exist");
        res.redirect("/");
    } else {
        res.render("./listings/update.ejs", { listing });
    }
}));
router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    let updateListing = await Listing.findByIdAndUpdate(id, listing);
    if (!updateListing) {
        req.flash("error", "Listing dose not updated");
        res.redirect("/");
    } else {
        req.flash("success", "Listing is updated");
        res.redirect(`/listing/${id}`);
    }

}));


// delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
        req.flash("error", "Listing dose not deleted");
        res.redirect("/");
    }
    else {
        req.flash("success", "Listing is deleted");
        res.redirect("/");
    }
}));

// Show Listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing dose not exist");
        res.redirect("/");
    } else {
        res.render("./listings/show.ejs", { listing });
    }
}));

module.exports = router;