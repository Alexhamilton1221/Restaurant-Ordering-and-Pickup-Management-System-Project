const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting user name
router.get("/name", async (req, res) => {
  try {
    const user = await User.findOne({}, "name"); // Retrieve only the name field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name age username password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one user
router.get("/:id", getUser, (req, res) => {
  res.send(res.user);
});

// Creating a new user
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one user
router.patch("/:id", getUser, async (req, res) => {
  if (req.body != null) {
    res.user.name = req.body.name;
    res.user.age = req.body.age;
    res.user.username = req.body.username;
    res.user.password = req.body.password;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one user
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "Deleted user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Cannot find user" });
  }
  res.user = user;
  next();
}

module.exports = router;
