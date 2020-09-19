const owoify = require("owoify-js").default;
const {
  findGuild,
  addGuildChannel,
  removeGuildChannel,
} = require("../Database");

module.exports = {
  name: "channel",
  /**
   * @param {import("../Client")} client
   * @param {import("discord.js").Message} msg
   * @param {Array<String>} args
   */
  func: async (client, msg, args) => {
    if (msg.member.hasPermission("MANAGE_WEBHOOKS")) {
      try {
        const guild = await findGuild(client.mongo, msg.guild.id);
        if (!guild) {
          msg.channel.send(owoify("This server is not set up."));
        } else if (args[0]) {
          if (guild.channels.includes(args[0])) {
            await removeGuildChannel(client.mongo, msg.guild.id, args[0]);
            msg.channel.send(owoify(`Channel (${args[0]}) has been removed.`));
          } else {
            const channel = msg.guild.channels.resolve(args[0]);
            if (channel) {
              await addGuildChannel(client.mongo, msg.guild.id, channel.id);
              msg.channel.send(owoify(`Channel (${args[0]}) has been added.`));
            } else {
              msg.channel.send(owoify("Invalid Channel ID."));
            }
          }
        } else if (guild.channels.includes(msg.channel.id)) {
          await removeGuildChannel(client.mongo, msg.guild.id, msg.channel.id);
          msg.channel.send(owoify("This channel has been removed."));
        } else {
          await addGuildChannel(client.mongo, msg.guild.id, msg.channel.id);
          msg.channel.send(owoify("This channel has been added."));
        }
      } catch (error) {
        throw error;
      }
    } else {
      msg.channel.send(
        "You're unable to run this command. Missing Permission: `Manage Webhooks`"
      );
    }
  },
};
