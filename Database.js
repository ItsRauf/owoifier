/**
 * @typedef {Object} GuildDoc
 * @property {String} _id
 * @property {Array<String>} channels
 * @property {String} lang
 * @property {Object} config
 * @property {Array<String>} config.ignored_users
 * @property {Array<String>} config.ignored_channels
 */

const { MongoClient } = require("mongodb");

module.exports = function Database() {
  return new Promise((res, rej) => {
    const client = new MongoClient(process.env.DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) return rej(err);
      return res(client);
    });
  });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 */
module.exports.addGuild = (mongo, guild) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.insertOne({
    _id: guild,
    channels: [],
    lang: "owo",
    config: {
      ignored_users: [],
      ignored_channels: [],
    },
  });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 */
module.exports.resetGuild = async (mongo, guild) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  const original = await guilds.findOne({ _id: guild });
  return guilds.replaceOne(
    { _id: guild },
    {
      _id: guild,
      channels: [],
      lang: "owo",
      config: {
        ignored_users: [],
        ignored_channels: [],
      },
      webhook: original.webhook,
    }
  );
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @returns {Promise<GuildDoc>}
 */
module.exports.findGuild = (mongo, guild) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.findOne({ _id: guild });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} lang
 */
module.exports.setGuildLang = (mongo, guild, lang) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.updateOne({ _id: guild }, { $set: { lang } });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {Object} webhook
 */
module.exports.setGuildWebhook = (mongo, guild, webhook) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.updateOne({ _id: guild }, { $set: { webhook } });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} channel
 */
module.exports.addGuildChannel = (mongo, guild, channel) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.updateOne({ _id: guild }, { $push: { channels: channel } });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} channel
 */
module.exports.addGuildIgnoredChannel = (mongo, guild, channel) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.updateOne(
    { _id: guild },
    { $push: { "config.ignored_channels": channel } }
  );
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} user
 */
module.exports.addGuildIgnoredUser = (mongo, guild, user) => {
  const guilds = mongo.db(process.env.DBNAME).collection("guilds");
  return guilds.updateOne(
    { _id: guild },
    { $push: { "config.ignored_users": user } }
  );
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} channel
 */
module.exports.removeGuildChannel = (mongo, guild, channel) => {
  const guilds = mongo.db(process.env.DB_NAME).collection("guilds");
  return guilds.updateOne({ _id: guild }, { $pull: { channels: channel } });
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} channel
 */
module.exports.removeGuildIgnoredChannel = (mongo, guild, channel) => {
  const guilds = mongo.db(process.env.DB_NAME).collection("guilds");
  return guilds.updateOne(
    { _id: guild },
    { $pull: { "config.ignored_channels": channel } }
  );
};

/**
 *
 * @param {MongoClient} mongo
 * @param {String} guild
 * @param {String} user
 */
module.exports.removeGuildIgnoredUser = (mongo, guild, user) => {
  const guilds = mongo.db(process.env.DB_NAME).collection("guilds");
  return guilds.updateOne(
    { _id: guild },
    { $pull: { "config.ignored_users": user } }
  );
};
