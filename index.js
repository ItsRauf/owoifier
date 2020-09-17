// Add environment vars from .env
require("dotenv").config();
const Database = require("./Database");
const Client = require("./Client");

const client = new Client();

Database()
  .then((mongo) => {
    console.log("Connected to MongoDB");
    client
      .init(mongo)
      .then(() => {
        console.log("Connected to Discord");
      })
      .catch((err) => {
        console.log(err);
        process.exit();
      });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
