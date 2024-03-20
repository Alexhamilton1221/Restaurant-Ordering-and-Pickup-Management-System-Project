const express = require("express"); // express web server
const router = express.Router();
const User = require("../models/user");

// Getting all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getUser, (req, res) => {
  //   res.send(res.user.name);
  res.send(res.user);

  //   res.send(res.user._id);
});

// Creating one
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
router.patch("/:id", getUser, async (req, res) => {
  if (req.body != null) {
    res.user.name = req.body.name;
  }

  if (req.body.age != null) {
    res.user.age = req.body.age;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one
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
