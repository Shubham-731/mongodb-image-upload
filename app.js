// Loading packages/modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const imgRoute = require("./routes/image");

// Init express
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Template engine setup
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Method override
app.use(methodOverride("_method"));

// Enabling image route
app.use("/", imgRoute);

// Connect with DB!
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log(err));

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
