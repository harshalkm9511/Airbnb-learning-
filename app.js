const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/lists");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const validateListing = require("./utils/validateListing");
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
        throw new ExpressError(500, "Database cannot be connect");
    });

app.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find();
    if (!lists) {
        throw new ExpressError(500, "Cannot load Listings");
    }
    res.render("./layouts/listings/home.ejs", { lists });
}));

app.get("/listing/new", (req, res) => {
    res.render("./layouts/listings/form.ejs");
});

app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
}));

app.get("/listing/edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(403, "Listing not found!");
    }
    res.render("./layouts/listings/update.ejs", { listing });
}));

app.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing; 
    if (!listing) {
        throw new ExpressError(403, "Listing not found!");
    }
    await Listing.findOneAndUpdate({ _id: id }, listing);
    res.redirect("/");
}));

app.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.deleteOne({ _id: id });
    res.redirect("/");
}));

app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(403, "Listing not found!");
    }
    res.render("./layouts/listings/show.ejs", { listing });
}));

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { status = 400, message = "Something is going on wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
    console.log("server is running");
});