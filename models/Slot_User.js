const db = require("../config/database");
const { DataTypes } = require("sequelize");


const Slot_User = db.define("slot_user", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Slot_User 