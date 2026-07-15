const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/lists");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then((res) => {
        console.log("Database is connected");
    })
    .catch((err) => {
        console.log(err);
    })

app.get("/", async (req, res) => {
    let lists = await Listing.find();
    res.render("./layouts/listings/home.ejs", { lists });
})

app.get("/listing/new", (req, res) => {
    res.render("./layouts/listings/form.ejs");
})
app.post("/listing", async (req, res, next) => {
    try {
        let listing = req.body.listing;
        let ans = await Listing.insertOne(listing);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
})

app.get("/listing/edit/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.find({ _id: id });
    listing = listing[0];
    res.render("./layouts/listings/update.ejs", { listing });
})
app.patch("/:id", async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findOneAndUpdate({ _id: id }, listing);
    res.redirect("/");
})

app.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.deleteOne({ _id: id });
    res.redirect("/");
})

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.find({ _id: id });
    listing = listing[0];
    res.render("./layouts/listings/show.ejs", { listing });
})

app.use((err, req, res, next) => {
    let { status = 400, message = "Something is going on wrong" } = err;
    res.status(status).send(message);
})

app.listen(port, () => {
    console.log("server is running");
})