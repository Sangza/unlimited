const mongoose = require("mongoose");
const { Users } = require("./user");
const { Spots } = require("../model/spot");

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
      // Removed any unique constraint that might exist here
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

// We don't add any unique index on transactionId in the payment schema
// This avoids uniqueness issues in the embedded document

const Payments = mongoose.model("Payment", paymentSchema);

exports.Payments = Payments;
exports.paymentSchema = paymentSchema;