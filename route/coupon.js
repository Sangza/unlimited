const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Coupons } = require("../model/coupon");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Users } = require("../model/user");
const {Spots} = require("../model/spot");


router.post("/", auth, admin, async (req, res) => {
  const couponn = await Coupons.findOne({ coupon: req.body.coupon });
  if (couponn) return res.status(400).send("Coupon already existed");


  const spot = await Spots.findById({_id:req.body.spotId});
  if(!spot) return res.status(400).send("spot doesn't exist")

  let coupon = new Coupons({
    coupon: req.body.coupon,
    owner: req.body.spotId,
    paidfor: req.body.paidfor,
    duration: req.body.duration,
    amount: req.body.amount,
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

  
  const spot = await Spots.findById({_id:req.body.spotId});
  if(!spot) return res.status(400).send("spot doesn't exist")

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
router.get("/getcoupon/:spotId/:id", auth, async (req, res) => {
  try {
     
   const spot = await Spots.findById({_id:req.params.spotId});
  if(!spot) return res.status(400).send("spot doesn't exist")

    const userId = await Users.findById({ _id: req.params.id });
    if (!userId) return res.status(400).send("user doesn't exist");

    const userCoupon = await Coupons.find({ "user.Id": req.params.id,
      spot:req.params.spotId
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
  const spot = await Spots.findById({_id:req.params.spotId});
  if(!spot) return res.status(400).send("spot doesn't exist")

  try {
    const coupon = await Coupons.findOne({
      spot:req.params.spotId,
      duration: req.params.duration,
      paidfor: false,
    });
    if (!coupon) return res.status(200).send("Not Found");
    res.status(200).json(coupon);
  } catch (error) {}
}); 

//update coupon status
router.put("/updatecoupon/:id", auth, async (req, res) => {
  const couponId = await Coupons.findById(req.params.id);
  if (!couponId) return res.status(400).send("Not Found");

  const coup = await Coupons.updateOne(
    { _id: req.params.id },
    {
      $set: {
        paidfor: req.body.paidfor,
        user: {
          Id: req.body.userId,
          paymentId: req.body.paymentId,
        },
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    coupon: couponId.coupon,
    duration: couponId.duration,
    coup,
  });
});

module.exports = router;
