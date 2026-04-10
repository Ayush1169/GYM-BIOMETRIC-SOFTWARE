const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);