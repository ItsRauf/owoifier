const fs = require("fs").promises;
const { resolve } = require("path");

module.exports = async function CommandLoader() {
  const files = await fs.readdir(resolve("commands"));
  const commands = new Map();
  for await (const file of files) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }
  return commands;
};
