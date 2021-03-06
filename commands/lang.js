const owoify = require("owoify-js").default;
const { setGuildLang, findGuild } = require("../Database");

module.exports = {
  name: "lang",
  /**
   * @param {import("../Client")} client
   * @param {import("discord.js").Message} msg
   * @param {Array<String>} args
   */
  func: async (client, msg, args) => {
    const langs = ["owo", "uwu", "uvu"];
    if (msg.member.hasPermission("MANAGE_WEBHOOKS")) {
      const guild = await findGuild(client.mongo, msg.guild.id);
      if (!guild) {
        msg.channel.send(owoify("This server is not set up."));
      } else if (args.length === 0) {
        msg.channel.send(owoify("Please provide a lang."));
      } else if (!langs.includes(args[0].toLowerCase())) {
        msg.channel.send(
          owoify("Invalid lang. Choose between `owo | uwu | uvu`")
        );
      } else {
        await setGuildLang(client.mongo, msg.guild.id, args[0].toLowerCase());
        msg.channel.send(
          owoify(`Language is now set to ${args[0].toLowerCase()}.`)
        );
      }
    } else {
      msg.channel.send(
        "You're unable to run this command. Missing Permission: `Manage Webhooks`"
      );
    }
  },
};
