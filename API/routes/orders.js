// orders.js

const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Middleware to get a single order by ID
async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error finding order" });
  }
  res.order = order;
  next();
}

// Getting all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get orders by user name
router.get("/user/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;
    const orders = await Order.find({ user: userName });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one order by ID
router.get("/:id", getOrder, (req, res) => {
  res.json(res.order);
});

// Creating a new order
router.post("/", async (req, res) => {
  const { user, restaurant, items, totalPrice } = req.body; // Extract user, restaurant, items, totalPrice from req.body

  try {
    // Create the order
    const newOrder = new Order({
      user,
      restaurant,
      items,
      totalPrice,
      status: "placed",
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the created order
    res.status(201).json(savedOrder);
  } catch (error) {
    // Handle any errors
    res.status(400).json({ message: error.message });
  }
});

// Updating an order by ID
router.patch("/:id", getOrder, async (req, res) => {
  try {
    const { user, restaurant, items, totalPrice } = req.body;

    // Update the order with the new information
    res.order.user = user;
    res.order.restaurant = restaurant;
    res.order.items = items;
    res.order.totalPrice = totalPrice;

    // Save the updated order
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting an order by ID
router.delete("/:id", getOrder, async (req, res) => {
  try {
    await res.order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
