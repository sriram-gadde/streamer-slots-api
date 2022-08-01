const db = require("../config/database");
const { DataTypes } = require("sequelize");

const Slot = db.define("slot", {
  slot_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  concurrent_users: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  slot_users: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tier: {
    type: DataTypes.STRING,
    defaultValue: "t3"
  },
  language: {
    type: DataTypes.STRING,
  },
  game: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

})

module.exports = Slot;