const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const moment = require("moment-timezone"); // Import Moment.js with time zone support

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
  const { user, restaurant, items, totalPrice, pickupTime } = req.body; // Extract user, restaurant, items, totalPrice, and pickupTime from req.body

  try {
    // Convert pickupTime to MST
    const mstPickupTime = moment.tz(pickupTime, "America/Denver").toDate();

    // Subtract 6 hours from the pickupTime to adjust for the forward shift
    const adjustedPickupTime = moment(mstPickupTime)
      .subtract(6, "hours")
      .toDate();

    // Create the order
    const newOrder = new Order({
      user,
      restaurant,
      items,
      totalPrice,
      pickupTime: adjustedPickupTime, // Adjusted pickupTime
      status: "ordered",
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
// Updating an order status by ID
router.patch("/:id/status", getOrder, async (req, res) => {
  try {
    const { status } = req.body;

    // Check if the new status is one of the allowed values
    if (
      !["ordered", "in-progress", "awaiting-pickup", "completed"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update the order status
    res.order.status = status;

    // Save the updated order
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Update order status by ID
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.status = status;

    // Save the changes to the order
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
