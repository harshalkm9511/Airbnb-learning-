const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/reviews.js");

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
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database is connected successfully.");
    } catch (err) {
        console.log(err);
    }
}

main();


app.get("/", (req, res) => {
    res.redirect("/listing");
})

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);

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