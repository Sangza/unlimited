const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./route/auth");
const user = require("./route/user");
const coupon = require("./route/coupon");
const payment = require("./route/payment");
const dotenv = require("dotenv")
// const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config()

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt is not defined");
  process.exit(1);
}

// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
//   ssl: true,
//   tls: true,
// });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/coupon", coupon);
app.use("/api/payment", payment);

// await client.connect()

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function run() {
  try {
    // Connect to MongoDB
    console.log(process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI).then(()=>{
      console.log("✅ Successfully connected to MongoDB!");
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`🚀 Server is listening on port ${port}`);
      });
    })
    // await client.db("admin").command({ ping: 1 });
    } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit if unable to connect to the database
  }
}

run();

