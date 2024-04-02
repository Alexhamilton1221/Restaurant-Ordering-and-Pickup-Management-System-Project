const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: String, // Assuming user is identified by some unique string value
    required: true,
  },
  restaurant: {
    type: String, // Storing restaurant name instead of ID
    required: true,
  },
  items: [
    {
      menuItem: {
        type: String, // Storing menu item name instead of ID
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      cost: {
        type: Number, // Adding cost field for each item
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["placed", "processing", "completed"],
    default: "placed",
  },
});

module.exports = mongoose.model("Order", orderSchema);
