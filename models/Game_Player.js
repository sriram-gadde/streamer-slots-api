const db = require("../config/database")
const { DataTypes } = require("sequelize")


const Game_Player = db.define("game_player", {
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

module.exports = Game_Player