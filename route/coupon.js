const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Coupons } = require("../model/coupon");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Users } = require("../model/user");
const { Spots } = require("../model/spot");
const { Payments } = require("../model/payment");

router.post("/", auth, admin, async (req, res) => {
  try {
    // Check that the referenced spot exists
    const spot = await Spots.findById(req.body.spotId);
    if (!spot) return res.status(400).send("Spot doesn't exist");

    // Check for duplicate coupon code
    const existingCoupon = await Coupons.findOne({ coupon: req.body.coupon });
    if (existingCoupon) return res.status(400).send("Coupon already exists");

    // Create new coupon document
    let coupon = new Coupons({
      coupon: req.body.coupon,
      spot: req.body.spotId,
      paidfor: req.body.paidfor,
      duration: req.body.duration,
      amount: req.body.amount,
    });

    // Save coupon to database
    await coupon.save();
    res.status(200).send({ message: "Created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/batch", auth, admin, async (req, res) => {
  if (!Array.isArray(req.body.coupons)) {
    return res
      .status(400)
      .send("Request body should contain an array of coupons");
  }


  const spot = await Spots.findById({ _id: req.body.spotId });
  if (!spot) return res.status(400).send("spot doesn't exist")

  try {
    const couponCodes = req.body.coupons.map((c) => c.coupon);
    const existingCoupons = await Coupons.find({
      coupon: { $in: couponCodes },
    });

    if (existingCoupons.length > 0) {
      return res.status(400).send({
        message: "Some coupons already exist",
        duplicates: existingCoupons.map((c) => c.coupon),
      });
    }

    const couponsToInsert = req.body.coupons.map((couponData) => ({
      coupon: couponData.coupon,
      owner: couponData.spotId,
      paidfor: couponData.paidfor,
      duration: couponData.duration,
      amount: couponData.amount,
    }));

    const result = await Coupons.insertMany(couponsToInsert);

    res.status(200).send({
      message: "Coupons created successfully",
      count: result.length,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//coupons paid by a particular user
router.get("/getcoupon/:id", auth, async (req, res) => {
  try {
    const userId = await Users.findById({ _id: req.params.id });
    if (!userId) return res.status(400).send("user doesn't exist");

    const userCoupon = await Coupons.find({
      "user.Id": req.params.id,
    });
    console.log(userId);
    if (!userCoupon.length) return res.status(400).send("no coupon found");

    res.status(200).send(userCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//get an unpaid Coupon
router.get("/getunpaid/:spotId/:duration", async (req, res) => {
  const spot = await Spots.findById({ _id: req.params.spotId });
  if (!spot) return res.status(400).send("spot doesn't exist")

  try {
    const coupon = await Coupons.findOne({
      spot: req.params.spotId,
      duration: req.params.duration,
      paidfor: false,
    });
    if (!coupon) return res.status(200).send("Not Found");
    res.status(200).json(coupon);
  } catch (error) { }
});

//update coupon status
router.put("/updatecoupon/:id", auth, async (req, res) => {
  const couponId = await Coupons.findById(req.params.id);
  if (!couponId) return res.status(400).send("Not Found");

  const payment = await Payments.findById(req.body.paymentId);
  if (!payment) return res.status(400).send("paymentId doesn't exist")

  if (couponId.amount == payment.amount) {
    const coup = await Coupons.updateOne(
      { _id: req.params.id },
      {
        $set: {
          paidfor: req.body.paidfor,
          user: {
            Id: req.body.userId,
            paymentId: {
              status: payment.status,
              _id: payment._id,
              createdAt: payment.createdAt
            },
          },
        },
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    coupon: couponId.coupon,
    duration: couponId.duration,
    status: payment.status
  });
});

module.exports = router;
