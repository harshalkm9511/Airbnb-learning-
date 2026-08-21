const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");


router.get("/", (req, res) => {
    res.redirect("/listing");
});
router.get("/signin", (req, res) => {
    res.render("./users/login.ejs");
});
router.post("/signin",
    passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }),
    wrapAsync(async (req, res) => {
        console.log(req.session.redirectUrl);
        if (req.session.redirectUrl) {
            console.log(req.session.redirectUrl);
            res.redirect(req.session.redirectUrl);
        } else {
            req.flash("success", "Welcome to wonderlust! You successfully logedin");
            res.redirect("/listing");
        }
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
        let registerUser = await User.register(user1, req.body.password);
        req.login(registerUser, (err) => {
            if (err) {
                req.flash("error", "User cannot login");
                res.redirect("/signin");
            }
            if (req.session.redirectUrl) {
                res.redirect(req.session.redirectUrl);
            }
            else {
                req.flash("success", "Welcome to wonderlust");
                res.redirect("/listing");
            }
        })

    } catch (err) {
        req.flash("error", "User is already exists");
        res.redirect("/user/signup");
    }
}));

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logout");
        res.redirect("/listing");
    })
})

module.exports = router;