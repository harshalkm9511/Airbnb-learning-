const mongoose = require("mongoose");
const { type } = require("node:os");

const listSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

let Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;