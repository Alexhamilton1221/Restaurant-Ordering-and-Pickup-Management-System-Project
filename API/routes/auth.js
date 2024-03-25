const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  try {
    // Find user by username and password in the database
    const user = await User.findOne({ username, password });

    if (!user) {
      // User not found or password incorrect, return error response
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Authentication successful, return success response with user object
    console.log(`Welcome ${user.name}`);
    return res.status(200).json({ message: "Login successful", user }); // Return user object
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
