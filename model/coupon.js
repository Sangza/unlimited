const mongoose = require("mongoose");
const { Users } = require("./user");
const { ref } = require("joi");
const { paymentSchema } = require('./payment');
const { priceSchema } = require('./price');


const couponSchema = new mongoose.Schema({
  coupon: {
    type: String,
    required: true,
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId
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
  createdBy: {
    type: Date
  },
  user: {
    Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    paymentId: {
      type: paymentSchema,
    }
  },
  purchase: {
    type: Date,
  },
});

const Coupons = mongoose.model("Coupon", couponSchema);

exports.couponSchema = couponSchema;
exports.Coupons = Coupons;
