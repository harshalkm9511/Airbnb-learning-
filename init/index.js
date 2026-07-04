const mongoose = require("mongoose");
const Listings = require("../models/lists.js");
const sampleData = require("./initListing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })


Listings.insertMany(sampleData)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })