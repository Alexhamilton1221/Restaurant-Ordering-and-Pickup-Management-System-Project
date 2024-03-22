// backend/index.js

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const userRouter = require("./routes/users");
app.use("/users", userRouter);

const restaurantRouter = require("./routes/restaurants");
app.use("/restaurants", restaurantRouter);

const orderRouter = require("./routes/orders");
app.use("/orders", orderRouter);

// Mount authentication routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
