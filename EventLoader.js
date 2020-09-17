const fs = require("fs").promises;
const { resolve } = require("path");

module.exports = async function EventLoader() {
  const files = await fs.readdir(resolve("events"));
  const events = new Map();
  for await (const file of files) {
    const event = require(`./events/${file}`);
    events.set(event.name, event);
  }
  return events;
};
