const mongoose = require("mongoose");
const { Users } = require("./user");

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
  user: {
    Id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
});

const Coupons = mongoose.model("Coupon", couponSchema);

exports.couponSchema = couponSchema;
exports.Coupons = Coupons;
