const express = require("express");
const router = express.Router();
const { Users } = require("../model/user");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Payments } = require("../model/payment");

//post payment
router.post("/", auth, async (req, res) => {
  const user = await Users.findById(req.body.userId);
  if (!user) return res.status(400).send("User does not exist");

  let payment = new Payments({
    user: {
      _id: user._id,
    },
    amount: req.body.amount,
    transactionId: req.body.transactionId,
    status: "successful",
  });

  try {
    const payments = await payment.save();
    res.status(200).json({
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//get all payment amount
router.get("/", admin, auth, async (req, res) => {
  try {
    const payment = await Payments.find();
    if (!payment.length) return res.status(400).send("No payments yet");

    let totalAmount = payment.reduce((sum, payment) => sum + payment.amount, 0);
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//get all the payment  amount for a particular user;
router.get("/getpayment/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) res.status(400).send("UserId not found");

    const payment = await Payments.find({ user: userId });
    if (!payment.length) return res.status(400).send(0);

    let totalAmount = payment.reduce((sum, payment) => sum + payment.amount, 0);
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
