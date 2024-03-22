// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Example authentication route
router.post("/login", async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  try {
    // Find user by username in the database
    const user = await User.findOne({ username });

    if (!user) {
      // User not found, return error response
      console.log("User not found");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored password directly
    if (user.password !== password) {
      // Password incorrect, return error response
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Authentication successful, return success response
    console.log(`Welcome ${user.name}`);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
