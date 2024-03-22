const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
  ],
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  soldOut: {
    type: Boolean,
    default: false, // By default, items are not sold out
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = { Restaurant, MenuItem };
