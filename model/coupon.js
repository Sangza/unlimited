const mongoose = require("mongoose");
const { Users } = require("./user");
const { paymentSchema } = require("./payment");
const { priceSchema } = require("./price");

const couponSchema = new mongoose.Schema({
  coupon: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness of coupon codes
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spots",
    required: true, // Ensure every coupon is linked to a spot
  },
  paidfor: {
    type: Boolean,
    default: false, // Default unpaid status
  },
  duration: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null, // Ensure it's nullable until assigned
    },
    paymentId: {
      type: [paymentSchema],
      default: [], // Default to empty array
    },
  },
  purchase: {
    type: Date,
  },
});

const Coupons = mongoose.model("Coupon", couponSchema);

exports.couponSchema = couponSchema;
exports.Coupons = Coupons;
