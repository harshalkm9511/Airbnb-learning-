const express = require("express");
const router = express.Router({mergeParams:true});

const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});
router.post("/signup", async (req, res) => {
    let user1 = new User({
        email: req.body.email,
        username: req.body.username
    });

    let result = await User.register(user1, req.body.password);
    res.send("user is registered");
});

router.get("/signin", (req, res) => {
    res.render("./users/login.ejs");
});
router.post("/signin", async (req, res) => {
    let result = await User.find({ username: req.body.username });
    if (result && result.length) {
        res.send(`Hello ${result[0].username} this is your account session`);
    } else {
        res.send("Account not found");
    }
})

module.exports = router;