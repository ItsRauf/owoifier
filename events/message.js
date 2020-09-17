const { findGuild } = require("../Database");

/**
 * @param {String} content
 * @returns {[String, Array<String>]}
 */
function parseContent(content) {
  const [prefix, cmdName, ...args] = content.split(" ");
  return [cmdName.toLowerCase(), ...args];
}

/**
 * @param {import("../Client")} client
 * @param {import("discord.js").Message} msg
 */
function CommandHandler(client, msg) {
  const [cmdName, ...args] = parseContent(msg.content);
  if (client.commands.has(cmdName)) {
    client.commands.get(cmdName).func(client, msg, args);
  }
}

module.exports = {
  name: "message",
  /**
   * @param {import("../Client")} client
   * @param {import("discord.js").Message} msg
   */
  func: async (client, msg) => {
    try {
      if (msg.author.bot) return;
      if (
        msg.content.startsWith(process.env.PREFIX) ||
        msg.content.startsWith(client.user.toString())
      ) {
        CommandHandler(client, msg);
      } else {
        const guild = await findGuild(client.mongo, msg.guild.id);
        if (guild && guild.channels.length > 0) {
          if (guild.channels.includes(msg.channel.id)) {
            const owoify = require("owoify-js").default;
            await msg.delete({
              timeout: 1000,
            });
            const webhooks = await msg.guild.fetchWebhooks();
            const webhook = webhooks.get(guild.webhook.id);
            if (webhook.channelID !== msg.channel.id) {
              await webhook.edit({
                channel: msg.channel.id,
              });
            }
            webhook.send(owoify(msg.cleanContent, guild.lang), {
              username: msg.member.displayName,
              avatarURL: msg.author.avatarURL(),
            });
          }
        }
      }
    } catch (error) {
      throw error;
    }
  },
};