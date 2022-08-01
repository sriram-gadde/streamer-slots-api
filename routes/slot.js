const express = require("express")
const router = express.Router()
const Slot = require("../models/Slot")
const { check, validationResult } = require("express-validator")
const { auth, auth_slot_manager } = require("../middleware/auth")
const Slot_User = require("../models/Slot_User")

// Make route to create a new slot in the database
router.post("/", [
  check("slot_name", "Slot name is required").not().isEmpty(),
  // check("start_date", "Start date is required").not().isEmpty(),
  // check("end_date", "End date is required").not().isEmpty(),
  check("start_time", "Start time is required").not().isEmpty(),
  check("end_time", "End time is required").not().isEmpty(),
  check("game", "Game is required").not().isEmpty(),
  auth_slot_manager
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }



    let { slot_name, start_date, end_date, start_time, end_time, duration, concurrent_users, tier, language, game } = req.body

    // slot manager should not be able to create multiple slots with the same combination of game ,language and tier 
    if (!language) language = "EN"
    if (!tier) tier = "t3"
    let slot = await Slot.findOne({
      where: {
        game,
        tier,
        language
      }
    })
    if (slot) {
      return res.status(400).json({ msg: "Slot already exists" })
    }



    // This is temporary for testing purposes, in production the start_date, end_date come from client only
    start_date = Date.now()
    end_date = Date.now()

    const newSlot = await Slot.create({
      slot_name,
      start_date,
      end_date,
      start_time,
      end_time,
      duration,
      concurrent_users,
      tier,
      language,
      game
    })
    res.json(newSlot)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make Route to update a slot in the database
router.put("/:id", auth_slot_manager, async (req, res) => {
  const { slot_name, start_date, end_date, start_time, end_time, duration, concurrent_users, tier, language, game } = req.body
  try {

    // Update the slot by the given id in the database
    await Slot.update({
      slot_name,
      start_date,
      end_date,
      start_time,
      end_time,
      duration,
      concurrent_users,
      tier,
      language,
      game
    }, {
      where: {
        id: req.params.id
      },
    })

    const slot = await Slot.findByPk(req.params.id)

    res.json(slot)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make Route to delete a slot in the database
router.delete("/:id", auth_slot_manager, async (req, res) => {
  try {
    // Delete the slot by the given id in the database
    // First delete all the slot users in this slot
    await Slot_User.destroy({
      where: {
        slot_id: req.params.id
      }
    })
    // Then delete the slot
    await Slot.destroy({
      where: {
        id: req.params.id
      }
    })
    // Send a response to the client
    res.json({ msg: `Slot with the id ${req.params.id} deleted` })

  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make a route to see all the slots
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.findAll()
    res.json(slots)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make a route so that a streamer can participate in a slot
// What i want to do here is just take input from the user about which slot id he wants to participate.
// Then I want to check if the slot is available or not.
// If it is available, then I want to add the user to the slot_user table.
// If it is not available, then I want to send a response to the user saying that the slot is full.
router.post("/:id/streamer", auth, async (req, res) => {
  try {
    const slot = await Slot.findByPk(req.params.id)
    console.log(slot)
    if (slot.concurrent_users >= slot.slot_users) {
      // Dont allow slot user to enter if he already is in that slot
      const slot_user = await Slot_User.findOne({
        where: {
          user_id: req.user.id,
          slot_id: req.params.id
        }
      })
      if (slot_user) {
        return res.json({ msg: "You are already in this slot" })
      }
      else {
        // Add the user to the slot_user table
        const slot_user = await Slot_User.create({
          user_id: req.user.id,
          slot_id: slot.id
        })


        // Update the slot_users column in the slot table
        await Slot.update({
          slot_users: slot.slot_users + 1
        }, {
          where: {
            id: slot.id
          }
        })

        res.json(slot_user)
      }

    }
    else {
      console.log(slot.slot_users)
      res.json({ msg: "Slot is full" })
    }
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)

// Make a route to see all the slots that a user is participating in
router.get("/streamer", auth, async (req, res) => {
  try {
    const slots = await Slot_User.findAll({
      where: {
        user_id: req.user.id
      }
    })
    res.json(slots)
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)





// Make a route to cancel users participation in a slot
// Only cancel if the user participated in the slot less than 30 mins ago
// If the user participated in the slot more than 30 mins ago, then he not allowed to cancel
// Delete the slot_user from the slot_user table
// Update the slot_users column in the slot table
router.delete("/:id/streamer", auth, async (req, res) => {
  try {
    const slot = await Slot.findByPk(req.params.id)
    const slot_user = await Slot_User.findOne({
      where: {
        user_id: req.user.id,
        slot_id: req.params.id
      }
    })
    if (slot_user) {
      const now = Date.now()
      const slot_user_created_at = slot_user.created_at;
      const diff = now - slot_user_created_at;
      if (diff < 1800000) {
        // Delete the slot_user from the slot_user table
        await Slot_User.destroy({
          where: {
            user_id: req.user.id,
            slot_id: req.params.id
          }
        })


        // Update the slot_users column in the slot table
        await Slot.update({
          slot_users: slot.slot_users - 1
        }, {
          where: {
            id: slot.id
          }
        })
        res.json({ msg: "You have successfully cancelled your participation in this slot" })
      }
      else {
        res.json({ msg: "You can not cancel your participation in this slot" })
      }
    }
    else {
      res.json({ msg: "You are not participating in this slot" })
    }
  }
  catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
)





module.exports = router;



