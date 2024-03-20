// Operations for restaurants

const express = require("express");
const router = express.Router();
const { Restaurant } = require("../models/restaurant");

// Middleware to get a single restaurant by ID
async function getRestaurant(req, res, next) {
  let restaurant;
  try {
    restaurant = await Restaurant.findById(req.params.id);
    if (restaurant == null) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error finding restaurant" });
  }
  res.restaurant = restaurant;
  next();
}

// Getting all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one restaurant by ID
router.get("/:id", getRestaurant, (req, res) => {
  res.json(res.restaurant);
});

// Creating a new restaurant
router.post("/", async (req, res) => {
  const restaurant = new Restaurant({
    name: req.body.name,
    location: req.body.location,
    rating: req.body.rating,
    // Add other restaurant attributes as needed
  });
  try {
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

module.exports = router;
