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
  return guilds.createIndex({
    _id: guild,
    channels: [],
    lang: "owo",
  });
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
module.exports.removeGuildChannel = (mongo, guild, channel) => {
  const guilds = mongo.db(process.env.DB_NAME).collection("guilds");
  return guilds.updateOne({ _id: guild }, { $pop: { channels: channel } });
};
