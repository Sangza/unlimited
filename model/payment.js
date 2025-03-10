const { default: mongoose } = require("mongoose");
const { Users } = require("./user");
const { Spots } = require("../model/spot")

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
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
      unique: true,
      required: true,
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

const Payments = new mongoose.model("Payment", paymentSchema);

exports.Payments = Payments;
exports.paymentSchema = paymentSchema;
