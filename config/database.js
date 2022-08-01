const { Sequelize } = require("sequelize");

const db = new Sequelize("streamer_slots", "root", process.env.SQL_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
