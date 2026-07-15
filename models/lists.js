const mongoose = require("mongoose");
const { type } = require("node:os");

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
    }
})

let Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;