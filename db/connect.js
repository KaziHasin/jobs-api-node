const mongoose = require("mongoose");
require("dotenv").config();
const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
