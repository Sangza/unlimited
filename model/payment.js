const mongoose = require("mongoose");
const couponSchema = require("../model/coupon");

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    coupon: {
      type: couponSchema
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spots"
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

  },
  { timestamps: true }
);

const Payments = mongoose.model("Payment", paymentSchema);

exports.Payments = Payments;
exports.paymentSchema = paymentSchema;