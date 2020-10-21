const owoify = require("owoify-js").default;
const {
  findGuild,
  resetGuild,
  addGuildIgnoredChannel,
  addGuildIgnoredUser,
  removeGuildIgnoredChannel,
  removeGuildIgnoredUser,
} = require("../Database");

module.exports = {
  name: "config",
  /**
   * @param {import("../Client")} client
   * @param {import("discord.js").Message} msg
   * @param {Array<String>} args
   */
  func: async (client, msg, [sub, ...args]) => {
    const guild = await findGuild(client.mongo, msg.guild.id);
    if (msg.member.hasPermission("MANAGE_WEBHOOKS")) {
      switch (sub) {
        case "reset":
          try {
            await resetGuild(client.mongo, guild._id);
            msg.channel.send(
              owoify("The current server's config has been reset.")
            );
          } catch (error) {
            msg.channel.send(owoify(`${error}`));
          }
          break;
        case "ignore":
          const option = args[0];
          args.shift();
          switch (option) {
            case "user":
              try {
                if (guild.config.ignored_users.includes(args[0])) {
                  await removeGuildIgnoredUser(
                    client.mongo,
                    guild._id,
                    args[0]
                  );
                  msg.channel.send(
                    owoify(`User (${args[0]}) has been un-ignored.`)
                  );
                } else {
                  await addGuildIgnoredUser(client.mongo, guild._id, args[0]);
                  msg.channel.send(
                    owoify(`User (${args[0]}) has been ignored.`)
                  );
                }
              } catch (error) {
                msg.channel.send(owoify(`${error}`));
              }
              break;
            case "channel":
              try {
                if (guild.config.ignored_channels.includes(args[0])) {
                  await removeGuildIgnoredChannel(
                    client.mongo,
                    guild._id,
                    args[0]
                  );
                  msg.channel.send(
                    owoify(`User (${args[0]}) has been un-ignored.`)
                  );
                } else {
                  await addGuildIgnoredChannel(
                    client.mongo,
                    guild._id,
                    args[0]
                  );
                  msg.channel.send(
                    owoify(`Channel (${args[0]}) has been ignored.`)
                  );
                }
              } catch (error) {
                msg.channel.send(owoify(`${error}`));
              }
              break;
          }
          break;
      }
    } else {
      msg.channel.send(
        "You're unable to run this command. Missing Permission: `Manage Webhooks`"
      );
    }
  },
};
