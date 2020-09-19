const owoify = require("owoify-js").default;
const {
  findGuild,
  addGuild,
  addGuildChannel,
  setGuildWebhook,
} = require("../Database");

module.exports = {
  name: "setup",
  /**
   * @param {import("../Client")} client
   * @param {import("discord.js").Message} msg
   * @param {Array<String>} args
   */
  func: async (client, msg, args) => {
    if (msg.member.hasPermission("MANAGE_WEBHOOKS")) {
      try {
        const guild = await findGuild(client.mongo, msg.guild.id);
        if (guild) {
          msg.channel.send(owoify("This server is already set up."));
        } else {
          await addGuild(client.mongo, msg.guild.id);
          await addGuildChannel(client.mongo, msg.guild.id, msg.channel.id);
          const webhook = await msg.channel.createWebhook("Owoifier", {
            avatar: client.user.avatarURL(),
          });
          await setGuildWebhook(client.mongo, msg.guild.id, {
            id: webhook.id,
          });
          msg.channel.send(owoify("This server is now set up."));
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
