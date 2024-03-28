const express = require("express");
const router = express.Router();
const { Restaurant, MenuItem } = require("../models/restaurant"); // Import the restaurant and menu item schemas

// Middleware to get a single restaurant by ID
async function getRestaurant(req, res, next) {
  let restaurant;
  try {
    restaurant = await Restaurant.findById(req.params.id).populate("menu");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error finding restaurant" });
  }
  res.restaurant = restaurant;
  next();
}

async function getRestaurantMenuById(req, res, next) {
  let restaurant;
  try {
    restaurant = await Restaurant.findById(req.params.restaurantId).populate(
      "menu"
    );
    if (!restaurant) {
      return res
        .status(404)
        .json({
          message: `Restaurant not found for ID: ${req.params.restaurantId}`,
        });
    }
  } catch (err) {
    console.error("Error finding restaurant:", err);
    return res.status(500).json({ message: "Error finding restaurant" });
  }
  res.restaurant = restaurant;
  next();
}

// Getting all restaurants with populated menu items
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("menu");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one restaurant by ID
router.get("/:id", getRestaurant, (req, res) => {
  res.json(res.restaurant);
});

// Getting a restaurant's menu by ID
router.get("/:restaurantId/menu", getRestaurantMenuById, (req, res) => {
  if (!res.restaurant) {
    return res.status(404).json({
      message: `In route Restaurant not found for ID: ${req.params.restaurantId}`,
    });
  }
  res.json(res.restaurant.menu);
});

// Create restaurant
router.post("/", async (req, res) => {
  try {
    const { name, location, rating, menu } = req.body;
    // Create the restaurant document
    const restaurant = new Restaurant({ name, location, rating });

    // Create an array to store the menu item IDs
    const menuItemIds = [];

    // Iterate over the menu items received in the request
    for (const menuItemData of menu) {
      // Create a new menu item document
      const menuItem = new MenuItem(menuItemData);

      // Save the menu item to the database
      await menuItem.save();

      // Push the ID of the newly created menu item to the array
      menuItemIds.push(menuItem._id);
    }

    // Assign the array of menu item IDs to the restaurant's menu property
    restaurant.menu = menuItemIds;

    // Save the restaurant document
    const newRestaurant = await restaurant.save();

    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update restaurant
router.patch("/:id", async (req, res) => {
  try {
    const { name, location, rating } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (name != null) {
      restaurant.name = name;
    }
    if (location != null) {
      restaurant.location = location;
    }
    if (rating != null) {
      restaurant.rating = rating;
    }
    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete restaurant
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    await restaurant.deleteOne();
    res.json({ message: "Deleted restaurant" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to restaurant's menu
router.post("/:id/menu", async (req, res) => {
  try {
    const { name, price, description, soldOut } = req.body;
    const menuItem = new MenuItem({
      name,
      price,
      description,
      soldOut: soldOut || false, // Default to false if not provided
    });
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove item from restaurant's menu
router.delete("/:restaurantId/menu/:itemId", async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuItemIndex = restaurant.menu.indexOf(itemId);
    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    restaurant.menu.splice(menuItemIndex, 1);
    await restaurant.save();
    res.json({ message: "Menu item removed from restaurant's menu" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetching a menu item by ID from a restaurant
router.get("/:restaurantId/menu/:itemId", async (req, res) => {
  const { restaurantId, itemId } = req.params;
  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    // Find the menu item by ID in the restaurant's menu
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET menu for a specific restaurant
router.get("/:restaurantId/menu", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId).populate("menu");
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found Looking for menu" });
    }
    // Return the menu of the restaurant
    res.json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
