// routes/orders.js

const express = require("express");
const router = express.Router();
const Order = require("../models/order");

const User = require("../models/user");
const { Restaurant, MenuItem } = require("../models/restaurant");

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

// Getting one order by ID
router.get("/:id", getOrder, (req, res) => {
  res.json(res.order);
});

// Creating a new order
router.post("/", async (req, res) => {
  const { userId, restaurantId, items } = req.body;

  try {
    // Check if the user and restaurant exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if items are available and not sold out
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      if (menuItem.soldOut) {
        return res
          .status(400)
          .json({ message: `${menuItem.name} is sold out` });
      }
    }

    // Calculate total price and create order
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      totalPrice += menuItem.price * item.quantity;
      orderItems.push({ menuItem: menuItem._id, quantity: item.quantity });
    }

    // Create the order
    const newOrder = new Order({
      user: userId,
      restaurant: restaurantId,
      items: orderItems,
      totalPrice: totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Updating an order by ID
router.patch("/:id", getOrder, async (req, res) => {
  try {
    const { userId, restaurantId, items } = req.body;

    // Check if the provided user ID exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided restaurant ID exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update the order with the new information
    res.order.user = userId;
    res.order.restaurant = restaurantId;
    res.order.items = items;

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
