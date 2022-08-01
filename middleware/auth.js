const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');


// make a middleware to check auth token and return user in req.user if valid token
const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
}

// Make a middleware to check if the user is authenticated, and if the user is authenticated then check if he is slot_manager or not
const auth_slot_manager = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    if (user.role !== "slot_manager") {
      return res.status(401).json({ msg: "You are not authorized to perform this action" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}


module.exports = { auth, auth_slot_manager }