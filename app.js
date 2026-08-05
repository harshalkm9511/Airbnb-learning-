const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/reviews.js");
const User = require("./models/user.js");

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

const sessionOptions = {
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: Date.now() + 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demoUser", async(req, res)=>{
    let fakeUser = new User({
        email:"harshal101@gmail.com",
        username:"harshal101"
    });

    let registerUser = await User.register(fakeUser, "harshal@123");
    res.send(registerUser);
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