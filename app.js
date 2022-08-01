const express = require("express");

// Allow local env variables
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

// Database Connection Check
const db = require("./config/database");
db.authenticate() 
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Middleware 
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/slot", require("./routes/slot"));
app.use("/api/game", require("./routes/game"));

// App Config
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
