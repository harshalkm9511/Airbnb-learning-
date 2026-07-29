const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/lists");
const Reviews = require("./models/reviews");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const validateListing = require("./utils/validateListing");
const validateReview = require("./utils/validateReview");


const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
async function main() {
    await mongoose.connect(MONGO_URL)
}
main()
    .then((res) => {
        console.log("Database is connected");
    })
    .catch((err) => {
        console.log("Database connection failed.", err);
        process.exit(1);
    });

app.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find();
    res.render("./listings/home.ejs", { lists });
}));

//create Listing
app.get("/listing/new", (req, res) => {
    res.render("./listings/form.ejs");
});
app.post("/listing/new", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
}));

//edit Listing
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("./listings/update.ejs", { listing });
}));
app.patch("/listing/:id", validateListing, wrapAsync(async (req, res) => {
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
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
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
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
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
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.redirect("/");
}));

// Show Listing
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("./listings/show.ejs", { listing });
}));

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 400, message = "Something is going on wrong" } = err;
    res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
    console.log("server is running");
});