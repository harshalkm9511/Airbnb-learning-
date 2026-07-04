const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const Listing = require("./models/lists");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

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
    res.render("home.ejs", {lists});
})

app.get("/listing/new", (req, res)=>{
    res.render("form.ejs");
})
app.post("/listing", async (req, res)=>{
    let {title,description, image, price, location, country} = req.body;
    console.log(req.body);  
    let ans = await Listing.insertOne({
        title:title,
        description:description,
        image:{
            filename:"listingFile",
            url:image
        },
        price:price,
        location:location,
        country:country
    });
    console.log(ans);
    res.redirect("/");  
    
})

app.get("/listing/update/:id", async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.find({_id:id});
    listing = listing[0];
    console.log(listing);
    res.render("update.ejs", {listing});
})
app.patch("/:id", async(req, res)=>{
    let {id} = req.params;
    let{title, description, image, price, location, country} = req.body;
    console.log(req.body);
    let ans = await Listing.updateOne({_id:id}, {
        title:title,
        description:description,
        image:{
            filename:"listingfile",
            url:image
        },
        price:price,
        location:location,
        country:country
    })
    console.log(ans);
    res.redirect("/");
})

app.delete("/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.deleteOne({_id:id});
    res.redirect("/");
})

app.get("/listing/:id", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.find({_id:id});
    listing = listing[0];
    console.log(listing);
    res.render("show.ejs", {listing});
})





app.listen(port, () => {
    console.log("server is running");
})