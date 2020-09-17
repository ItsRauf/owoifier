// Add environment vars from .env
require("dotenv").config();
const Database = require("./Database");

Database()
  .then((mongo) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
