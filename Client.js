const { Client: DiscordJSClient } = require("discord.js");
const EventLoader = require("./EventLoader");
const CommandLoader = require("./CommandLoader");

/**
 * @class Client
 * @property {import("mongodb").MongoClient} mongo
 * @property {Map<String, Object>} events
 * @property {Map<String, Object>} commands
 * @extends {DiscordJSClient}
 */
module.exports = class Client extends DiscordJSClient {
  /**
   * @param {import("mongodb").MongoClient} mongo
   * @returns
   */
  async init(mongo) {
    this.mongo = mongo;
    this.events = await EventLoader();
    [...this.events.values()].map((event) => {
      this.on(event.name, (...args) => event.func(this, ...args));
    });
    this.commands = await CommandLoader();
    return this.login(process.env.TOKEN);
  }
};
