const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", (req, res) => {
    res.redirect("/signin");
});
router.get("/signin", (req, res) => {
    res.render("./users/login.ejs");
});
router.post("/signin",
    passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome to wonderlust! You successfully logedin");
        res.redirect("/listing");
    }));

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let user1 = new User({
            email: req.body.email,
            username: req.body.username
        });
        let result = await User.register(user1, req.body.password);

        req.flash("success", "Welcome to wonderlust");
        res.redirect("/listing");
    } catch (err) {
        console.log(err);
        req.flash("error", "User is already exists");
        res.redirect("/user/signup");
    }
}));

module.exports = router;