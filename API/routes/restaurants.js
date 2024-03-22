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

router.post("/", async (req, res) => {
  const { name, location, rating, menu } = req.body;

  try {
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

// Updating a restaurant by ID
router.patch("/:id", getRestaurant, async (req, res) => {
  if (req.body.name != null) {
    res.restaurant.name = req.body.name;
  }
  if (req.body.location != null) {
    res.restaurant.location = req.body.location;
  }
  if (req.body.rating != null) {
    res.restaurant.rating = req.body.rating;
  }
  try {
    const updatedRestaurant = await res.restaurant.save();
    res.json(updatedRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a restaurant by ID
router.delete("/:id", getRestaurant, async (req, res) => {
  try {
    await res.restaurant.deleteOne();
    res.json({ message: "Deleted restaurant" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to restaurant's menu
router.post("/:id/menu", getRestaurant, async (req, res) => {
  const { name, price, description, soldOut } = req.body;
  const menuItem = new MenuItem({
    name,
    price,
    description,
    soldOut: soldOut || false, // Default to false if not provided
  });
  try {
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove item from restaurant's menu
// Deleting a menu item from a restaurant
router.delete("/:restaurantId/menu/:itemId", async (req, res) => {
  const { restaurantId, itemId } = req.params;

  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the menu item exists in the restaurant's menu
    const menuItemIndex = restaurant.menu.indexOf(itemId);
    if (menuItemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Menu item not found in restaurant's menu" });
    }

    // Remove the menu item from the restaurant's menu
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

module.exports = router;
