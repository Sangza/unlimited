const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./route/auth");
const user = require("./route/user");
const coupon = require("./route/coupon");
const payment = require("./route/payment");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt is not defined");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/coupon", coupon);
app.use("/api/payment", payment);

mongoose.connect("mongodb://localhost/unlimited").then(() => {
  console.log("Connecting to Mongodb");
  const port = process.env.Port || 3000;
  app.listen(port, () => console.log("connecting to localhost", port));
})
