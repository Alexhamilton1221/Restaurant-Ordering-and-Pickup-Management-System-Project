const fs = require("fs/promises");
const express = require("express"); // express web server
const cors = require("cors");
const _ = require("lodash"); //
const { v4: uuid } = require("uuid"); // generate unique IDs

const mongoose = require("mongoose"); // for database
require("dotenv").config(); // for database environment vars
const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

//Connect to database
db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("Connected to Database"));

const userRouter = require("./routes/users");
app.use("/users", userRouter);

// // Create
// app.get("/users", (req, res) => {
//   //Fetch User Data
//   res.send("This is working!");
// });

app.listen(3000, () => console.log("API server is running."));
