const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Coupons } = require("../model/coupon");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { route } = require("./user");

router.post("/", auth, admin, async (req, res) => {
  const couponn = await Coupons.findOne({ coupon: req.body.coupon });
  if (couponn) return res.status(400).send("Coupon already existed");

  let coupon = new Coupons({
    coupon: req.body.coupon,
    hostel: req.body.hostel,
    paidfor: req.body.paidfor,
    duration: req.body.duration,
  });

  try {
    const coupons = await coupon.save();
    res.status(200).send({
      message: "created successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/batch", auth, admin, async (req, res) => {
  if (!Array.isArray(req.body.coupons)) {
    return res
      .status(400)
      .send("Request body should contain an array of coupons");
  }

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
      hostel: couponData.hostel,
      paidfor: couponData.paidfor,
      duration: couponData.duration,
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

//coupon paid by a particular user
router.get("/getcoupon", auth, async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).send("Put an Id");

    const userCoupon = await Coupons.find({ user: userId, paidfor: true });
    if (!userCoupon.length) return res.status(400).send("no coupon found");

    res.status(200).json(userCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
