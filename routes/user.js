const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config")
const { check, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");

// Create a new user
router.post("/", [
  check("first_name", "first_name is required").isString().notEmpty(),
  check("username", "username is required").isString().notEmpty(),
  check("password", "password is required").not().isEmpty(),
  check("tier", "tier is required").isString().notEmpty()], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { first_name, last_name, username, phone, email, password, tier } =
      req.body;

    if (!email && !phone) {
      return res.status(400).json({
        msg: "email or phone is required"
      });
    }


    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    try {
      const user = await User.create({
        first_name,
        last_name,
        username,
        phone,
        email,
        password,
        tier,
      });

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  });

// Make a route to login a user and return a token
router.post("/login",
  [
    check("username", "username is required").isString().notEmpty(),
    check("password", "password is required").isString().notEmpty()
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  })

// Make route to get user info from token and return user info from sql database
router.get("/me", auth, async (req, res) => {
  try {
    // Get user by his id from the sql database and dont send  the password just the other details
    let user = await User.findByPk(req.user.id);
    user.password = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
}
);

// Make route to update user info of the user from token and return user info from sql database
router.put("/me", auth, async (req, res) => {
  try {
    // Get user by his id from the sql database and dont send the password just the other details
    let user = await User.findByPk(req.user.id);

    // Update the user info
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.username = req.body.username;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.tier = req.body.tier;

    // Hash the password if it is changed 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // Save the user info
    await user.save();
    user.password = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
}
);

// Make route to delete user info of the user from token and return user info from sql database
router.delete("/me", auth, async (req, res) => {
  try {
    // Get user by his id from the sql database and dont send the password just the other details
    let user = await User.findByPk(req.user.id);

    // Delete the user info
    await user.destroy();
    res.json({ msg: "User deleted" });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
}
);



module.exports = router;
