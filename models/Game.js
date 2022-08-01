const db = require("../config/database")
const { DataTypes } = require("sequelize")

const Game = db.define("game", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  language: {
    type: DataTypes.STRING,
  }
}
)

module.exports = Game