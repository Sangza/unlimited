const mongoose = require("mongoose");
const { Users } = require("./user");
const { ref } = require("joi");

const couponSchema = new mongoose.Schema({
  coupon: {
    type: String,
    required: true,
  },
  hostel: {
    type: String,
    required: true,
  },
  paidfor: Boolean,
  duration: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payments",
    },
  },
  purchase: {
    type: Date,
  },
});

const Coupons = mongoose.model("Coupon", couponSchema);

exports.couponSchema = couponSchema;
exports.Coupons = Coupons;
