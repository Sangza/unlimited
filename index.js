const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./route/auth");
const user = require("./route/user");
const coupon = require("./route/coupon");
const payment = require("./route/payment");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;


if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt is not defined");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tls: true,
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/coupon", coupon);
app.use("/api/payment", payment);

mongoose.connect("mongodb://localhost/unlimited").then(() => {
  console.log("Connecting to Mongodb");
})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("connecting to localhost", port));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

