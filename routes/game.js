const express = require("express")
const router = express.Router()
const Game = require("../models/Game")
const Game_Player = require("../models/Game_Player")
const { check, validationResult } = require("express-validator")
const { auth_slot_manager } = require("../middleware/auth")

// Make route for creating a game in the database
router.post("/", [
  check("name", "name is required").not().isEmpty(),
  auth_slot_manager
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let { name, description, image, language } = req.body

    const game = await Game.create({
      name,
      description,
      image,
      language
    })
    res.json(game)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make route for updating a game in the database
router.put("/:id", auth_slot_manager, async (req, res) => {
  const { name, description, image, language } = req.body
  try {
    await Game.update({
      name,
      description,
      image,
      language
    }, {
      where: {
        id: req.params.id
      }
    })
    // Send updated game
    const game = await Game.findByPk(req.params.id)
    res.json(game)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)


// Make a route for deleting a game from the database
router.delete("/:id", auth_slot_manager, async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    if (!game) {
      return res.status(404).json({ msg: "Game not found" })
    }
    await game.destroy()
    res.json({ msg: "Game deleted" })
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make a route for getting all games from the database
router.get("/", async (req, res) => {
  try {
    const games = await Game.findAll()
    res.json(games)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)




module.exports = router
