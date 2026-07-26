const mongoose = require("mongoose");
const { type } = require("node:os");
const {Schema} = mongoose;
const Reviews = require("./reviews");

const listSchema = mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://i.sstatic.net/bkC9s.jpg",
        set: (v) => {
            return v === "" ? "https://i.sstatic.net/bkC9s.jpg" : v;
        }
    },
    price: {
        type: Number,
        default: 0,
        set: (n) => {
            return n == null ? 0 : n;
        }
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Reviews"
    }]
})

let Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;