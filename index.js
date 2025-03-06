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
  minVersion: 'TLSv1.2', // Enforce TLS 1.2
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/coupon", coupon);
app.use("/api/payment", payment);

// mongoose.connect("mongodb://localhost/unlimited").then(() => {
//   console.log("Connecting to Mongodb");
//   const port = process.env.Port || 3000;
//   app.listen(port, () => console.log("connecting to localhost", port));
// })

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

