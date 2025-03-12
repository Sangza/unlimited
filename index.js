const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./route/auth");
const user = require("./route/user");
const coupon = require("./route/coupon");
const payment = require("./route/payment");
const spot = require('./route/spot');
const price = require('./route/price');
const dotenv = require("dotenv")
dotenv.config()

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
app.use("/api/spot", spot);
app.use("/api/price", price);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function run() {
  try {
    // Connect to MongoDB
    console.log(process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("✅ Successfully connected to MongoDB!");
      const port = process.env.PORT || 7000;
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

